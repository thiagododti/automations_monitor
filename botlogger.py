import requests
import time
from datetime import datetime


class Botlogger:
    def __init__(self, automation):
        # Em ambiente de desenvolvimento, evita enviar mensagens para o Bitrix24
        self.em_implementacao = True

        # Dados essenciais para o funcionamento do Botlogger
        self.automation = automation
        self.token = "afa2384709c91a21e519cd585a3a87e234da6698"
        self.execution = None
        self.execution_id = None
        self.etapa = None
        self.etapa_id = None
        self.url = "http://localhost:8081"
        self.headers = {"Authorization": f"Token {self.token}"}

        self.execution_url = f"{self.url}/api/executions/"
        self.patch_execution_url = f"{self.url}/api/executions/{{id}}/"
        self.step_url = f"{self.url}/api/executions/steps/"
        self.patch_step_url = f"{self.url}/api/executions/steps/{{id}}/"
        self.log_url = f"{self.url}/api/executions/logs/"

    def _safe_request(self, method, url, retries=3, backoff=1, **kwargs):
        for attempt in range(retries):
            try:
                response = requests.request(method, url, timeout=5, **kwargs)
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

    def inicio_execucao(self):
        data = {
            "status": "iniciado",
            "automation": self.automation
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

    def fim_etapa(self):
        if not self.etapa_id:
            return

        self._safe_request(
            "PATCH",
            self.patch_step_url.format(id=self.etapa_id),
            json={"status": "concluido"},
            headers=self.headers
        )

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


def teste():
    import random
    import time
    # quantidade de execuções que você quer simular
    TOTAL_EXECUCOES = 20

    for _ in range(TOTAL_EXECUCOES):

        automation_id = random.randint(1, 4)

        botlogger = Botlogger(automation=automation_id)
        botlogger.inicio_execucao()

        total_etapas = random.randint(1, 15)

        todas_falharam = True
        teve_alerta = False

        for i in range(1, total_etapas + 1):

            botlogger.inicio_etapa(f"Etapa {i}")

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

            time.sleep(0.2)  # opcional (simular tempo)

        # regra final da execução
        if todas_falharam:
            botlogger.erro_execucao(mensagem="Todas as etapas falharam")

        elif teve_alerta:
            botlogger.alerta_execucao(
                mensagem="Execução concluída com alertas")

        else:
            botlogger.fim_execucao()

        time.sleep(0.5)  # opcional


def teste_erro():
    botlogger = Botlogger(automation=1)
    botlogger.inicio_execucao()
    botlogger.inicio_etapa("Etapa 1")
    botlogger.erro_etapa(mensagem="Erro na etapa 1")
    botlogger.erro_execucao(mensagem="Erro na execução")


def teste_alerta():
    botlogger = Botlogger(automation=1)
    botlogger.inicio_execucao()
    botlogger.inicio_etapa("Etapa 1")
    botlogger.alerta_etapa(mensagem="Alerta na etapa 1")
    botlogger.alerta_execucao(mensagem="Alerta na execução")


if __name__ == "__main__":
    teste()
    # teste_erro()
    # teste_alerta()
