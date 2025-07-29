# 🚀 Workflow GitHub Actions - Deploy Automático

Este diretório contém o workflow do GitHub Actions para automatizar o build e deploy da aplicação Monitor de Qualidade do Ar.

## 📋 Funcionalidades do Workflow

### **🔍 Validação (`validate`)**
- ✅ Verificação de sintaxe HTML com `html-validate`
- ✅ Verificação de sintaxe CSS com `stylelint`
- ✅ Verificação de sintaxe JavaScript com `eslint`
- ✅ Verificação da estrutura de arquivos essenciais

### **🔨 Build (`build`)**
- 📦 Instalação de dependências de build
- 🗜️ Minificação de HTML (remove espaços, comentários)
- 🗜️ Minificação de CSS (otimização de tamanho)
- 🗜️ Minificação de JavaScript (compressão e ofuscação)
- 📊 Geração de estatísticas de build
- 📤 Upload de artefatos para uso posterior

### **🌐 Deploy (`deploy`)**
- 🚀 Deploy automático no GitHub Pages
- 🔧 Configuração automática do ambiente Pages
- ✅ Verificação de integridade do deploy
- 📍 Geração de URL da aplicação publicada

### **💬 Comentários (`pr-comment`)**
- 📝 Comentário automático em Pull Requests
- 📊 Informações detalhadas do build
- 🔍 Status de validação e otimização

## 🎯 Triggers do Workflow

### **Execução Automática:**
- ✅ Push para `main` ou `master` → Validação + Build + Deploy
- ✅ Pull Request **aberta** para `main` ou `master` → Validação + Build + Comentário
- ✅ Pull Request **atualizada** (novos commits) → Validação + Build + Comentário
- ✅ Pull Request **reaberta** → Validação + Build + Comentário
- ✅ Execução manual via interface do GitHub

### **Tipos de Eventos de Pull Request:**
- `opened` - Quando uma nova PR é aberta
- `synchronize` - Quando novos commits são adicionados à PR
- `reopened` - Quando uma PR fechada é reaberta

### **Comportamento por Evento:**
| Evento | Validação | Build | Deploy | Comentário |
|--------|-----------|--------|--------|------------|
| Push para main | ✅ | ✅ | ✅ | ❌ |
| PR aberta | ✅ | ✅ | ❌ | ✅ |
| PR atualizada | ✅ | ✅ | ❌ | ✅ |
| PR reaberta | ✅ | ✅ | ❌ | ✅ |
| Manual | ✅ | ✅ | ✅* | ❌ |

*Deploy manual apenas se executado na branch main

## ⚙️ Configuração Necessária

### **1. Habilitar GitHub Pages**
```bash
# No repositório GitHub:
Settings → Pages → Source: GitHub Actions
```

### **2. Permissões do Workflow**
O workflow já está configurado com as permissões necessárias:
- `contents: read` - Leitura do código
- `pages: write` - Escrita no GitHub Pages
- `id-token: write` - Autenticação OIDC

### **3. Estrutura de Arquivos Esperada**
```
sinquia_evertec_workshop/
├── location-app/
│   ├── index.html     # Página principal
│   ├── styles.css     # Estilos
│   └── script.js      # Lógica JavaScript
├── .github/workflows/
│   └── deploy.yml     # Este workflow
└── package.json       # Configuração do projeto
```

## 📊 Otimizações de Performance

### **Minificação HTML:**
- Remove espaços em branco desnecessários
- Remove comentários
- Remove atributos redundantes
- Minifica CSS e JS inline

### **Minificação CSS:**
- Compressão de propriedades
- Remoção de espaços e comentários
- Otimização de seletores

### **Minificação JavaScript:**
- Compressão de código
- Ofuscação de variáveis (mangle)
- Remoção de código morto
- Otimização de escopo

## 🔍 Debugging e Troubleshooting

### **Falhas Comuns:**

#### **1. Erro de Validação**
```bash
# Verificar localmente:
npm run validate
npm run validate:html
npm run validate:css
npm run validate:js
```

#### **2. Erro de Build**
```bash
# Testar build local:
npm run build
npm run serve  # Testar aplicação otimizada
```

#### **3. Erro de Deploy**
- Verificar se GitHub Pages está habilitado
- Verificar permissões do workflow
- Verificar se a branch está correta

### **Logs Úteis:**
- 📋 **Validação**: Mostra erros de sintaxe
- 📊 **Build**: Estatísticas de tamanho dos arquivos
- 🔍 **Deploy**: URL da aplicação publicada

## 🚀 Como Executar Localmente

### **Setup Inicial:**
```bash
# Instalar dependências
npm install

# Executar validação
npm run validate

# Executar build completo
npm run build

# Servir aplicação localmente
npm run dev      # Versão desenvolvimento
npm run serve    # Versão otimizada
```

### **Scripts Disponíveis:**
- `npm run dev` - Servidor de desenvolvimento (porta 3000)
- `npm run build` - Build completo (validação + otimização)
- `npm run validate` - Apenas validação
- `npm run serve` - Servidor da versão otimizada (porta 8080)
- `npm run clean` - Limpar arquivos gerados

## 📈 Monitoramento

### **GitHub Actions:**
- ✅ Status dos workflows na aba "Actions"
- 📊 Tempo de execução e logs detalhados
- 📦 Artefatos gerados disponíveis por 30 dias

### **GitHub Pages:**
- 🌐 URL automática: `https://octocaio.github.io/sinquia_evertec_workshop/`
- 📊 Analytics na aba "Insights"
- 🔄 Histórico de deploys

---

**🤖 Workflow mantido automaticamente**  
**🏢 Sinquia Evertec Workshop**  
**🌬️ Monitor de Qualidade do Ar**
