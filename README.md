# Desafios do Workshop de Hackathon de Agentes Copilot e MCP

Bem-vindo ao repositório do Workshop de Hackathon Copilot! Aqui você encontrará quatro arquivos de desafios práticos, cada um projetado como um documento markdown independente para ajudá-lo a praticar a construção de aplicações web e backend modernas.


## 🚀 Status do Projeto

[![🌬️ Air Quality App CI/CD](https://github.com/octocaio/sinquia_evertec_workshop/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/octocaio/sinquia_evertec_workshop/actions/workflows/ci-cd.yml)
[![🧪 Air Quality App Tests](https://github.com/octocaio/sinquia_evertec_workshop/actions/workflows/test-air-quality-app.yml/badge.svg)](https://github.com/octocaio/sinquia_evertec_workshop/actions/workflows/test-air-quality-app.yml)
[![✨ Code Quality](https://github.com/octocaio/sinquia_evertec_workshop/actions/workflows/code-quality.yml/badge.svg)](https://github.com/octocaio/sinquia_evertec_workshop/actions/workflows/code-quality.yml)

## 🌬️ Aplicação Implementada

**[Verificador da Qualidade do Ar](./air-quality-app/)** - ✅ **CONCLUÍDO**

Uma aplicação web completa que permite consultar a qualidade do ar em tempo real para qualquer localização no mundo.

**🔗 Demo ao vivo**: [https://octocaio.github.io/sinquia_evertec_workshop](https://octocaio.github.io/sinquia_evertec_workshop)

**Funcionalidades**:
- 🌍 Geocodificação inteligente via Nominatim API
- 🌬️ Dados de qualidade do ar em tempo real via Open-Meteo API
- 📊 IQA Europeu e Americano com códigos de cores
- 🧪 6 poluentes principais monitorados
- 💡 Avisos de saúde contextuais
- 📱 Interface responsiva e moderna
- ✅ CI/CD completo com GitHub Actions

## Visão Geral dos Desafios

**1. [W1 - Prompts do Workshop de Qualidade do Ar](./W1%20-%20air-quality-workshop-prompts.md)** ✅ **IMPLEMENTADO**  
*Desafio Introdutório – Recomendado para Usuários Iniciantes*  
Este é um desafio simples e passo a passo para construir uma aplicação web de Verificação da Qualidade do Ar. Ele orienta você através da estruturação de um frontend, conexão com APIs públicas, adição de testes e CI, e sugere melhorias adicionais. **Implementação completa disponível em [`air-quality-app/`](./air-quality-app/)**

**2. [W2.1 - Desafio Dashboard de Criptomoedas](./W2.1%20-%20crypto-dashboard-challenge.md)**  
Crie uma aplicação web de dashboard de criptomoedas em tempo real. Implemente recursos como visão geral do mercado, busca/filtro, gráficos de preços, lista de observação e manuseio seguro de API. Ideal para aqueles que buscam aprofundar suas habilidades de frontend e integração de API.

**3. [W2.2 - Desafio de Placares Esportivos](./W2.2%20-%20sports-scores-challenge.md)**  
Construa uma aplicação web para placares esportivos em tempo real, com suporte a dados ao vivo, filtragem, favoritos e acessibilidade. Este desafio enfatiza design responsivo e atualizações em tempo real.

**4. [W2.3 - Desafio MCP de Inventário](./W2.3%20-%20inventory-mcp-challenge.md)**  
Desenvolva um servidor backend para gerenciamento de inventário de armazém, implementando o Model Context Protocol (MCP). Você lidará com operações CRUD, movimentações de estoque, consulta/busca, conformidade com MCP e automação de CI.

---

## 🛠️ Tecnologias e Ferramentas

### Aplicação de Qualidade do Ar
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: Nominatim (geocodificação), Open-Meteo (qualidade do ar)
- **CI/CD**: GitHub Actions
- **Deploy**: GitHub Pages
- **Testes**: Playwright
- **Qualidade**: Prettier, ESLint, html-validate

### GitHub Actions Workflows
- **🌬️ CI/CD Principal**: Build, teste e deploy automático
- **🧪 Testes Específicos**: Testes focados na aplicação
- **✨ Qualidade de Código**: Validação e métricas

## Como Usar Estes Desafios

### 🚀 Para a Aplicação de Qualidade do Ar (Implementada)
1. **Clone o repositório**: `git clone https://github.com/octocaio/sinquia_evertec_workshop.git`
2. **Acesse a aplicação**: Navegue para `air-quality-app/` e abra `index.html`
3. **Execute localmente**: `npm start` ou abra o arquivo diretamente no navegador
4. **Veja o demo online**: [https://octocaio.github.io/sinquia_evertec_workshop](https://octocaio.github.io/sinquia_evertec_workshop)

### 📋 Para Outros Desafios
1. **Baixe** qualquer um dos arquivos de desafio `.md` acima.
2. **Crie um novo repositório** em sua própria conta corporativa do GitHub.
3. **Adicione o arquivo markdown** ao seu novo repositório e use-o como seu briefing do projeto.
4. **Siga as instruções** no desafio para desenvolver sua solução.
5. **Fique atento às pegadinhas** nas instruções - algumas APIs externas podem ter mudado ao longo do tempo. Seja flexível e procure maneiras de contornar inconsistências, incluindo considerar APIs alternativas e equivalentes.

## 📊 Scripts Disponíveis

```bash
npm start          # Inicia servidor local na porta 8080
npm run build      # Cria build da aplicação
npm run lint       # Verifica qualidade do código
npm run format     # Formata o código automaticamente
npm test           # Executa via GitHub Actions
```

Estes desafios são projetados para experimentação e aprendizado. Sinta-se livre para estender, modificar ou compartilhar suas soluções!

---

**🌟 Workshop Sinquia Evertec** - Demonstração completa de desenvolvimento com GitHub Copilot 🚀

Bom hacking!
