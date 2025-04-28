# 📋 Changelog

Todas as mudanças importantes deste projeto serão documentadas aqui.

O formato segue o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

---

## [1.1.0] - 2025-04-28

### ✨ Alterações
- Substituição do motor de impressão SumatraPDF pelo PDFtoPrinter
- Atualização dos scripts `install.bat` e `uninstall.bat`
- Atualização da documentação (`README.md`, `.release-notes.md`, `CHANGELOG.md`)
- Melhoria na listagem de impressoras (informações de status e jobs)

## [1.0.0] - 2025-04-25

### ✨ Features
- Criação do Print Middleware usando Node.js e Express
- Instalação automática de dependências (SumatraPDF e WinSW)
- Impressão silenciosa de PDFs via SumatraPDF
- Listagem de impressoras instaladas
- Health check do serviço via rota `/`
- Configuração externa de porta via `print-middleware.config`
- Criação dos scripts `install.bat` e `uninstall.bat`
- Logs de impressões detalhados com usuário, arquivo e impressora

### 📚 Documentação
- README.md com instruções completas de instalação e configuração
- Release Notes da versão inicial

---

## 🗓️ Histórico

| Versão | Data        | Descrição                           |
|:-------|:------------|:------------------------------------|
| 1.0.0  | 2025-04-25   | Primeira versão funcional publicada |

---
