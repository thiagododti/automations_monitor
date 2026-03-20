import requests
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import random
import winreg


class Botlogger:

    def __init__(self, automacao, empresa: str):
        # Recebimento de parametros
        self.automation_id = automacao
        self.empresa = empresa
        # URL base e headers comuns para todas as requisições
        self.token = "5adf23f326cd95e33e9b01305b710e8427a1a09b"
        self.url = "http://192.168.74.10"
        self.headers = {"Authorization": f"Token {self.token}"}

        self.automation_url = f"{self.url}/api/automations/{{id}}/"
        self.execution_url = f"{self.url}/api/executions/"
        self.patch_execution_url = f"{self.url}/api/executions/{{id}}/"
        self.step_url = f"{self.url}/api/executions/steps/"
        self.patch_step_url = f"{self.url}/api/executions/steps/{{id}}/"
        self.log_url = f"{self.url}/api/executions/logs/"
        self.business_url = f"{self.url}/api/business/"

        # Em ambiente de desenvolvimento, evita enviar mensagens para o Bitrix24

        self.business = None
        self.business_id = None
        # Dados essenciais para o funcionamento do Botlogger

        self.automation = None

        self.execution = None
        self.execution_id = None
        self.etapa = None
        self.etapa_id = None

        # busca e empresa
        self.get_empresa()
        self.get_automation()
        if self.automation and self.automation['in_manutention']:
            self.em_implementacao = True
        else:
            self.em_implementacao = False

        if self.automation and self.automation['auth_certificate']:
            self.troca_certificado()

    def _safe_request(self, method, url, retries=3, backoff=1, **kwargs):
        for attempt in range(retries):
            try:
                response = requests.request(
                    method, url, timeout=5, verify=False, **kwargs)
                response.raise_for_status()
                return response

            except requests.RequestException as e:
                if attempt < retries - 1:
                    wait = backoff * (2 ** attempt)
                    print(
                        f"[BOTLOGGER RETRY] tentativa {attempt+1} falhou: {e} | retry em {wait}s")
                    print(
                        f"Response erro: {e.response.text if e.response else 'No response'}")
                    time.sleep(wait)
                else:
                    print(f"[BOTLOGGER ERROR] falha definitiva: {e}")
                    return None

    def _safe_json(self, response):
        try:
            return response.json() if response else {}
        except Exception:
            return {}

    def send_bitrix_message(self, erro):
        automacao = self.execution.get('automation_data', {}).get(
            'name', 'N/A') if self.execution else 'N/A'
        inicio = self.execution.get(
            'date_start', 'N/A') if self.execution else 'N/A'
        if inicio != 'N/A':
            inicio = datetime.strptime(
                inicio.rstrip('Z'), "%Y-%m-%dT%H:%M:%S.%f").strftime("%d/%m/%Y %H:%M:%S")

        fim = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        url = "https://alldax.bitrix24.com.br/rest/1/6slk0zguhz3np170/im.message.add.json"

        # Validação: verifica se a mensagem está vazia
        if not automacao or not erro or not inicio or not fim:
            print(
                f"⚠️ AVISO: Campos obrigatórios faltando")
            return False

        message = f"🤖 Automação - {automacao}\n🆘 erro: {erro}\n▶️ Data Inicio: {inicio} | ⏸️ Data Fim: {fim}"
        params = {
            "DIALOG_ID": "chat184838",
            "MESSAGE": message
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins
            print(f"✅ Mensagem enviada com sucesso")
            return True
        except requests.exceptions.RequestException as e:
            # Substitua por logger.
            print(f"❌ Erro ao enviar mensagem: {e}")

    def log(self, mensagem):
        if not self.execution_id:
            return

        data = {
            "description": mensagem,
            "execution": self.execution_id
        }

        response = self._safe_request(
            "POST",
            self.log_url,
            json=data,
            headers=self.headers
        )

        log = self._safe_json(response)
        print(f"Log registrado: {log.get('id')}")

    def get_empresa(self):
        params = {
            "cnpj": self.empresa
        }
        response = self._safe_request(
            "GET",
            self.business_url,
            headers=self.headers,
            params=params
        )

        results = self._safe_json(response)

        self.business = results.get("results")

        if not results:
            raise ValueError(
                "Nenhum business encontrado para os parâmetros informados")

        self.business_id = int(self.business[0].get("id"))

        if not self.business_id:
            raise ValueError("Business encontrado, mas sem ID válido")

    def get_automation(self):

        response = self._safe_request(
            "GET",
            self.automation_url.format(id=self.automation_id),
            headers=self.headers,

        )

        self.automation = self._safe_json(response)

        if not self.automation:
            raise ValueError(
                "Nenhuma automação encontrada para os parâmetros informados")

    def update_string_value(self, name: str, value: str, path: str):
        try:
            with winreg.OpenKey(
                    winreg.HKEY_LOCAL_MACHINE,
                    path,
                    0,
                    winreg.KEY_SET_VALUE
            ) as key:
                winreg.SetValueEx(key, name, 0, winreg.REG_SZ, value)

        except PermissionError:
            raise PermissionError(
                "Permissão negada ao acessar o registro. Execute como administrador."
            )

        except FileNotFoundError:
            raise FileNotFoundError(
                f"Caminho do registro não encontrado: {path}"
            )

        except Exception as e:
            raise RuntimeError(
                f"Erro ao atualizar registro: {str(e)}"
            )

    def troca_certificado(self):
        path = r'SOFTWARE\Policies\Google\Chrome\AutoSelectCertificateForUrls'
        name = '1'

        # URL vem da automação
        url = self.automation.get("url_certificate")

        if not url:
            raise ValueError("A automação não possui 'url_certificate'.")

        # Considerando que você vai usar o primeiro business
        if not self.business or not isinstance(self.business, list):
            raise ValueError("Nenhum business informado.")

        business = self.business[0]

        # Validação dos campos obrigatórios
        required_fields = [
            "subject_cn", "subject_c", "subject_o",
            "issuer_cn", "issuer_c", "issuer_o"
        ]

        for field in required_fields:
            if not business.get(field):
                raise ValueError(
                    f"Campo obrigatório ausente no business: {field}")

        json_data = {
            "pattern": url,
            "filter": {
                "ISSUER": {
                    "CN": business["issuer_cn"],
                    "C": business["issuer_c"],
                    "O": business["issuer_o"],
                },
                "SUBJECT": {
                    "CN": business["subject_cn"],
                    "C": business["subject_c"],
                    "O": business["subject_o"],
                }
            }
        }

        import json
        self.update_string_value(name, json.dumps(json_data), path)

    def inicio_execucao(self):
        data = {
            "status": "iniciado",
            "automation": self.automation_id,
            "business": self.business_id
        }

        response = self._safe_request(
            "POST",
            self.execution_url,
            json=data,
            headers=self.headers
        )

        execution = self._safe_json(response)

        self.execution = execution
        self.execution_id = execution.get('id')

        print(f"Execução iniciada: {self.execution_id}")

    def fim_execucao(self):
        if not self.execution_id:
            return

        response = self._safe_request(
            "PATCH",
            self.patch_execution_url.format(id=self.execution_id),
            json={"status": "concluido"},
            headers=self.headers
        )

        execution = self._safe_json(response)
        print(f"Execução finalizada: {execution.get('id')}")

    def erro_execucao(self, mensagem):
        if not self.execution_id:
            return

        response = self._safe_request(
            "PATCH",
            self.patch_execution_url.format(id=self.execution_id),
            json={"status": "erro"},
            headers=self.headers
        )

        self.log(mensagem)
        if not self.em_implementacao:
            self.send_bitrix_message(erro=mensagem)

        execution = self._safe_json(response)
        print(f"Execução com erro: {execution.get('id')}")

    def alerta_execucao(self, mensagem):
        if not self.execution_id:
            return

        response = self._safe_request(
            "PATCH",
            self.patch_execution_url.format(id=self.execution_id),
            json={"status": "alerta"},
            headers=self.headers
        )

        self.log(mensagem)

        execution = self._safe_json(response)
        print(f"Execução com alerta: {execution.get('id')}")

    def inicio_etapa(self, identificacao):
        if not self.execution_id:
            return

        data = {
            "identification": identificacao,
            "status": "iniciado",
            "execution": self.execution_id
        }

        response = self._safe_request(
            "POST",
            self.step_url,
            json=data,
            headers=self.headers
        )

        step = self._safe_json(response)

        self.etapa = step
        self.etapa_id = step.get('id')

        print(f"Etapa iniciada: {self.etapa_id}")

    def fim_etapa(self, mensagem=None):
        if not self.etapa_id:
            return

        self._safe_request(
            "PATCH",
            self.patch_step_url.format(id=self.etapa_id),
            json={"status": "concluido"},
            headers=self.headers
        )

        if mensagem:
            self.log(mensagem)

        print(f"Etapa finalizada: {self.etapa_id}")

    def erro_etapa(self, mensagem):
        if not self.etapa_id:
            return

        self._safe_request(
            "PATCH",
            self.patch_step_url.format(id=self.etapa_id),
            json={"status": "erro"},
            headers=self.headers
        )

        self.log(mensagem)

        print(f"Etapa com erro: {self.etapa_id}")

    def alerta_etapa(self, mensagem):
        if not self.etapa_id:
            return

        self._safe_request(
            "PATCH",
            self.patch_step_url.format(id=self.etapa_id),
            json={"status": "alerta"},
            headers=self.headers
        )

        self.log(mensagem)

        print(f"Etapa com alerta: {self.etapa_id}")


def executar_automacao(automation_id):

    botlogger = Botlogger(automation=automation_id)
    botlogger.inicio_execucao()

    total_etapas = random.randint(1, 15)

    todas_falharam = True
    teve_alerta = False

    for i in range(1, total_etapas + 1):
        botlogger.inicio_etapa(f"Etapa {i}")
        time.sleep(random.uniform(15, 70))  # Simula tempo de execução da etapa
        resultado = random.choice(["sucesso", "erro", "alerta"])

        if resultado == "erro":
            botlogger.erro_etapa(mensagem=f"Erro na etapa {i}")

        elif resultado == "alerta":
            botlogger.alerta_etapa(mensagem=f"Alerta na etapa {i}")
            todas_falharam = False
            teve_alerta = True

        else:
            botlogger.fim_etapa()
            todas_falharam = False

    if todas_falharam:
        botlogger.erro_execucao(mensagem="Todas as etapas falharam")

    elif teve_alerta:
        botlogger.alerta_execucao(
            mensagem="Execução concluída com alertas")

    else:
        botlogger.fim_execucao()

    time.sleep(0.5)


def teste():
    TOTAL_SIMULTANEAS = 7  # exemplo

    with ThreadPoolExecutor(max_workers=TOTAL_SIMULTANEAS) as executor:
        futures = [
            executor.submit(executar_automacao, automation_id)
            for automation_id in range(1, TOTAL_SIMULTANEAS + 1)
        ]

        for future in futures:
            future.result()


def teste_erro():
    botlogger = Botlogger(automation=1)
    botlogger.inicio_execucao()
    botlogger.inicio_etapa("Etapa 1")
    botlogger.erro_etapa(mensagem="Erro na etapa 1")
    botlogger.erro_execucao(mensagem="Erro na execução")


def teste_alerta():
    # Instancia no inicio da automaçao
    botlogger = Botlogger(automation=1)
    botlogger.inicio_execucao()

    documentos = 100
    for documento in range(documentos):
        # inicia a etapa
        botlogger.inicio_etapa(f"Etapa {documento + 1}")

        ###################################################
        # executa a lógica da etapa (simulada por sleep)  #
        ###################################################

        # finaliza a etapa
        botlogger.fim_etapa()
        botlogger.alerta_etapa(mensagem=f"Alerta na etapa {documento + 1}")

        # ou, se tivesse um erro:
        botlogger.erro_etapa(mensagem=f"Erro na etapa {documento + 1}")

    # fim da execução
    botlogger.fim_execucao()
    botlogger.alerta_execucao(mensagem="Alerta na execução")

    # ou, se tivesse um erro:
    botlogger.erro_execucao(mensagem="Erro na execução")


if __name__ == "__main__":
    # teste()
    # teste_erro()
    # teste_alerta()

    botlogger = Botlogger(automacao=1, empresa='08880518000179')
