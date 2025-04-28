# 📈 Print Middleware

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey)
![Windows](https://img.shields.io/badge/Windows-Service-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Middleware local desenvolvido em Node.js com Express para impressão automática de etiquetas e documentos em impressoras instaladas na máquina, diretamente a partir de sistemas web.

## 🚀 Funcionalidades

- Impressão silenciosa de PDFs via [PDFtoPrinter](https://github.com/emendelson/pdftoprinter)
- Impressão para impressora padrão ou impressora específica
- Listagem de impressoras instaladas na máquina com status
- Logs com timestamp, nome do usuário e nome do arquivo impresso
- Serviço Windows autoinstalável para execução automática
- Rota de health check (`/`) para monitoramento rápido
- Armazenamento dos PDFs impressos na pasta `labels/` com timestamp
- Configuração flexível de porta via arquivo externo

---

## 📦 Requisitos

- Windows 10 ou 11
- Node.js 18+ para build (não é necessário Node.js após gerar o `.exe`)
- [PDFtoPrinter.exe portátil](https://github.com/emendelson/pdftoprinter)
- Impressoras instaladas no Windows

---

## 📂 Estrutura do projeto

```
C:\PrintMiddleware\
├── print-middleware.exe          # Executável gerado (após build)
├── PDFtoPrinter.exe                # Visualizador PDF portátil
├── print-middleware-service.exe  # Wrapper de serviço (WinSW)
├── print-middleware-service.xml  # Configuração do serviço
├── install.bat                   # Script de instalação
├── uninstall.bat                 # Script de desinstalação
├── print-middleware.config        # Arquivo de configuração de porta (opcional)
└── labels\                       # PDFs impressos
```

---

## 🛠️ Instalação

1. Clone este repositório.
2. Instale as dependências:

```bash
npm install
```

3. Gere o executável:

```bash
npm run build
```

4. Copie os seguintes arquivos para `C:\PrintMiddleware`:
   - `build/print-middleware.exe`
   - `build/print-middleware-service.exe`
   - `build/print-middleware-service.xml`
   - `build/install.bat`
   - `build/uninstall.bat`

5. Execute `install.bat` como administrador.
6. Configure o usuário do serviço no `services.msc`.
7. Inicie o serviço manualmente.

👉 O middleware estará disponível em `http://localhost:8787` ou na porta definida no arquivo de configuração.

---

## 📢 Configuração da Porta

É possível alterar a porta do middleware sem precisar rebuildar.

Crie ou edite o arquivo `print-middleware.config` na pasta `C:\PrintMiddleware` com o seguinte conteúdo:

```
PORT=8788
```

Se o arquivo existir, o middleware será iniciado na porta especificada.
Se não existir, usará a porta padrão 8787.

Após alterar a porta, reinicie o serviço para aplicar.

---

## 📚 Rotas Disponíveis

### ➡️ Health Check

**`GET /`**

```json
{
  "status": "ok",
  "message": "Print Middleware is running."
}
```

---

### ➡️ Listar impressoras

**`GET /printers`**

```json
{
  "printers": [
    "Microsoft Print to PDF",
    "Argox OS-2140",
    "Brother HL-L2350DW series"
  ]
}
```

---

### ➡️ Imprimir documento

**`POST /print`**

```json
{
  "base64": "base64_do_pdf",
  "userName": "usuario",
  "reportName": "etiqueta_produto",
  "printerName": "Argox OS-2140"   // Opcional, se não informado vai na impressora padrão
}
```

**Resposta:**

```json
{
  "status": "ok"
}
```

---

## 📅 Logs

- Todos os eventos de impressão são logados no console.
- Formato dos logs:

```
[2025-04-25 16:42:12] User "usuario" printed file "2025-04-25_16-42-12_etiqueta_produto.pdf" on printer "Argox OS-2140"
```

---

## ⚙️ Scripts

- `install.bat`:
  - Cria pastas necessárias
  - Baixa e extrai o SumatraPDF
  - Baixa o WinSW
  - Instala o serviço
  - Exibe instruções de configuração do serviço

- `uninstall.bat`:
  - Para e remove o serviço
  - Mata o processo print-middleware.exe se rodando
  - Remove arquivos e pastas (`labels/`, `logs/`, executáveis)
  - Opcionalmente remove toda a pasta `C:\PrintMiddleware`

---

## 📜 Licença

MIT © 2025 - Vinicius Colodetti