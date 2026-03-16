import requests


class Botlogger:
    def __init__(self, automation):
        self.automation = automation
        self.token = "e0f8e9db76dd8ca7525049ce6fa76cb444fa1a19"
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
        self.patch_log_url = f"{self.url}/api/executions/logs/{{id}}/"

    def inicio_execucao(self):

        data = {
            "status": "iniciado",
            "automation": self.automation
        }

        execution = requests.post(
            url=self.execution_url,
            json=data,
            headers=self.headers
        )

        self.execution = execution.json()
        self.execution_id = self.execution['id']

        print(f"Execução iniciada: {self.execution['id']}")

    def fim_execucao(self):
        data = {
            "status": "concluido",
        }
        execution = requests.patch(
            url=self.patch_execution_url.format(id=self.execution_id),
            json=data,
            headers=self.headers
        )
        print(f"Execução finalizada: {execution.json()['id']}")

    def log(self, mensagem):
        data = {
            "description": mensagem,
            "execution": self.execution_id
        }
        log = requests.post(
            url=self.log_url,
            json=data,
            headers=self.headers
        )
        print(f"Log registrado: {log.json()['id']}")

    def erro_execucao(self, mensagem):
        data = {
            "status": "erro",
        }
        execution = requests.patch(
            url=self.patch_execution_url.format(id=self.execution_id),
            json=data,
            headers=self.headers
        )
        self.log(mensagem)
        print(f"Execução com erro: {execution.json()['id']}")

    def alerta_execucao(self, mensagem):
        data = {
            "status": "alerta",
        }
        execution = requests.patch(
            url=self.patch_execution_url.format(id=self.execution_id),
            json=data,
            headers=self.headers
        )
        self.log(mensagem)
        print(f"Execução com alerta: {execution.json()['id']}")

    def inicio_etapa(self, identificacao):

        data = {
            "identification": identificacao,
            "status": "iniciado",
            "execution": self.execution_id
        }
        step = requests.post(
            url=self.step_url,
            json=data,
            headers=self.headers
        )
        self.etapa = step.json()
        self.etapa_id = self.etapa['id']
        print(f"Etapa iniciada: {self.etapa_id}")

    def fim_etapa(self):
        data = {
            "status": "concluido",
        }
        requests.patch(
            url=self.patch_step_url.format(id=self.etapa_id),
            json=data,
            headers=self.headers
        )
        print(f"Etapa finalizada: {self.etapa_id}")

    def erro_etapa(self, mensagem):
        data = {
            "status": "erro",
        }
        requests.patch(
            url=self.patch_step_url.format(id=self.etapa_id),
            json=data,
            headers=self.headers
        )
        self.log(mensagem)
        print(f"Etapa com erro: {self.etapa_id}")

    def alerta_etapa(self, mensagem):
        data = {
            "status": "alerta",
        }
        requests.patch(
            url=self.patch_step_url.format(id=self.etapa_id),
            json=data,
            headers=self.headers
        )
        self.log(mensagem)
        print(f"Etapa com alerta: {self.etapa_id}")


if __name__ == "__main__":
    botlogger = Botlogger(automation=1)
    botlogger.inicio_execucao()
    botlogger.inicio_etapa("Etapa 1")
    botlogger.erro_etapa("Erro na etapa 1")
    botlogger.erro_execucao("Erro na execução")
    botlogger.fim_etapa()
    botlogger.fim_execucao()
