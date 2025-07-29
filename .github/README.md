# 🚀 GitHub Actions Workflows

Este diretório contém os workflows automatizados do GitHub Actions para o projeto Sinquia Evertec Workshop.

## 📋 Workflows Disponíveis

### 1. 🌬️ CI/CD Principal (`ci-cd.yml`)
**Trigger**: Push para `main`, `demo-*` e Pull Requests para `main`

**Jobs**:
- **Validate**: Validação de HTML, CSS e JavaScript
- **Build**: Compilação e minificação dos arquivos
- **Test Integration**: Testes de integração com Playwright
- **Deploy**: Deploy automático para GitHub Pages (apenas main)
- **Comment PR**: Comentário automático em PRs com informações do build

**Funcionalidades**:
- ✅ Validação de código
- 🔨 Build e minificação
- 🧪 Testes automatizados
- 🚀 Deploy automático
- 💬 Feedback em PRs

### 2. 🧪 Testes da Aplicação (`test-air-quality-app.yml`)
**Trigger**: Mudanças na pasta `air-quality-app/`

**Funcionalidades**:
- ✅ Validação HTML
- 🔍 Verificação de estrutura de arquivos
- 🌐 Testes com Playwright
- 📊 Relatório de testes

### 3. ✨ Qualidade de Código (`code-quality.yml`)
**Trigger**: Push para `main`, `demo-*` e Pull Requests

**Funcionalidades**:
- 🎨 Verificação de formatação
- 📊 Estatísticas do projeto
- 📈 Métricas de código

## 🛠️ Ferramentas Utilizadas

- **Prettier**: Formatação de código
- **ESLint**: Linting JavaScript
- **html-validate**: Validação HTML
- **Playwright**: Testes de navegador
- **Terser**: Minificação JavaScript
- **CleanCSS**: Minificação CSS
- **html-minifier**: Minificação HTML

## 🔧 Configuração

### Pré-requisitos
- Node.js 20
- GitHub Pages habilitado no repositório
- Permissões adequadas para GitHub Actions

### Variáveis de Ambiente
Nenhuma variável de ambiente especial é necessária. Os workflows usam apenas recursos públicos.

## 📊 Outputs

### Artefatos Gerados
- **air-quality-app-build**: Aplicação compilada e minificada
- **test-results**: Relatórios de teste
- **project-stats**: Estatísticas do projeto

### GitHub Pages
- URL: `https://<username>.github.io/<repo-name>`
- Deploy automático após merge na branch `main`

## 🚀 Como Usar

1. **Push/PR**: Os workflows executam automaticamente
2. **Verificar Status**: Veja o status na aba Actions
3. **Review PRs**: Comentários automáticos com informações do build
4. **Deploy**: Merge na main para deploy automático

## 📈 Métricas

Os workflows geram automaticamente:
- 📊 Estatísticas de código
- 🗜️ Informações de compressão
- 🧪 Relatórios de teste
- ⏱️ Tempos de build

---

**Workshop Sinquia Evertec** - Demonstração de CI/CD com GitHub Actions 🚀
