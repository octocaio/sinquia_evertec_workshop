# 🌬️ Monitor de Qualidade do Ar - Sinquia Evertec Workshop

Uma aplicação web moderna que permite consultar o índice de qualidade do ar (IQA) em tempo real para qualquer localização do mundo. Desenvolvida como parte do workshop Sinquia Evertec.

## 📋 Funcionalidades Principais

### 🗺️ **Entrada de Localização**
- Campo **Cidade** (obrigatório)
- Campo **Estado/Província/Região** (obrigatório)  
- Campo **País** (opcional, Brasil como padrão)

### 🌡️ **Monitoramento de Qualidade do Ar**
- **Índice de Qualidade do Ar (AQI)** atual
- **Classificação visual** (Boa, Razoável, Moderada, Ruim, Muito Ruim)
- **Detalhamento de poluentes**:
  - PM2.5 (Material particulado fino)
  - PM10 (Material particulado grosso)
  - NO₂ (Dióxido de nitrogênio)
  - SO₂ (Dióxido de enxofre)
  - O₃ (Ozônio)
  - CO (Monóxido de carbono)

### 🛡️ **Alertas de Saúde**
- **Avisos personalizados** baseados no nível de qualidade do ar
- **Recomendações específicas** para diferentes grupos de risco
- **Identificação do poluente principal** responsável pela classificação

### ✅ **Validação e Experiência**
- Validação em tempo real enquanto o usuário digita
- Mensagens de erro específicas e claras
- Indicadores visuais de campos válidos/inválidos
- Interface responsiva e moderna

## 🚀 Como usar

1. **Abra o arquivo `index.html`** em qualquer navegador moderno
2. **Preencha os campos**:
   - Digite a cidade desejada
   - Digite o estado, província ou região
   - Opcionalmente, altere o país (Brasil é o padrão)
3. **Clique em "Consultar Qualidade do Ar"** 
4. **Aguarde o carregamento** dos dados de geocodificação e qualidade do ar
5. **Analise os resultados**:
   - Localização encontrada com coordenadas
   - Índice de qualidade do ar atual
   - Detalhes dos poluentes
   - Avisos de saúde quando aplicável
6. **Use "Limpar"** para fazer uma nova consulta

## 🛠️ Tecnologias e APIs utilizadas

### **Frontend**
- **HTML5** - Estrutura semântica moderna
- **CSS3** - Estilos responsivos com animações
- **JavaScript ES6+** - Lógica assíncrona e manipulação de APIs

### **APIs Externas**
- **[Nominatim OpenStreetMap](https://nominatim.openstreetmap.org/)** - Geocodificação gratuita
- **[Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)** - Dados de qualidade do ar em tempo real
- **Sem necessidade de tokens** ou autenticação

## 📁 Estrutura do projeto

```
location-app/
├── index.html      # Interface principal da aplicação
├── styles.css      # Estilos visuais e responsivos
├── script.js       # Lógica JavaScript e integração com APIs
└── README.md       # Documentação completa
```

## ✨ Recursos técnicos avançados

### **🔄 Processamento Assíncrono**
- Geocodificação automática da localização inserida
- Busca de dados de qualidade do ar em tempo real
- Indicadores visuais de carregamento
- Tratamento robusto de erros de rede

### **🎯 Experiência do usuário**
- Animações CSS suaves e responsivas
- Design adaptável para dispositivos móveis
- Feedback visual claro durante o processamento
- Botão de retry em caso de falha
- Scroll automático para resultados

### **🛡️ Segurança e Confiabilidade**
- Timeout de requisições (10 segundos)
- Escape de HTML para prevenir XSS
- Validação de dados de entrada e saída
- Tratamento de casos extremos e falhas de API

### **📊 Análise de Dados**
- Identificação automática do poluente principal
- Classificação por cores do índice AQI
- Avisos de saúde contextualizados
- Timestamp das medições

## 🌍 Classificação do Índice de Qualidade do Ar

| AQI | Categoria | Cor | Descrição |
|-----|-----------|-----|-----------|
| 0-20 | Boa | 🟢 Verde | Qualidade satisfatória, baixo risco |
| 21-40 | Razoável | 🟡 Amarelo | Aceitável, grupos sensíveis podem ter sintomas leves |
| 41-60 | Moderada | 🟠 Laranja | Grupos sensíveis podem apresentar sintomas |
| 61-80 | Ruim | 🔴 Vermelho | Problemas para grupos sensíveis, público geral pode sentir efeitos |
| 81+ | Muito Ruim | 🟣 Roxo | Condições de emergência, toda população pode ser afetada |

## 🏥 Poluentes Monitorados

- **PM2.5**: Material particulado fino (≤ 2.5 μm) - penetra profundamente nos pulmões
- **PM10**: Material particulado grosso (≤ 10 μm) - causa irritação respiratória
- **NO₂**: Dióxido de nitrogênio - irritante pulmonar, principalmente de veículos
- **SO₂**: Dióxido de enxofre - irritante respiratório, principalmente industrial
- **O₃**: Ozônio troposférico - oxidante forte, prejudicial aos pulmões
- **CO**: Monóxido de carbono - reduz capacidade de transporte de oxigênio

## � Casos de uso

Esta aplicação é ideal para:
- **Monitoramento diário** da qualidade do ar
- **Planejamento de atividades** ao ar livre
- **Alertas para grupos sensíveis** (crianças, idosos, asmáticos)
- **Comparação entre diferentes** localidades
- **Estudos ambientais** e educação sobre poluição
- **Sistemas de saúde pública** para alertas preventivos

## ⚠️ Tratamento de Erros

A aplicação lida elegantemente com:
- **Localização não encontrada** - sugestões de correção
- **Timeout de rede** - retry automático disponível  
- **APIs indisponíveis** - mensagens explicativas
- **Dados incompletos** - fallbacks e valores padrão
- **Conectividade limitada** - indicadores de status

## 📝 Validações implementadas

### **Campos obrigatórios:**
- **Cidade**: Mínimo 2 caracteres, apenas letras válidas
- **Estado**: Mínimo 2 caracteres, apenas letras válidas  
- **País**: Opcional, validado se preenchido

### **Segurança:**
- Sanitização de entradas do usuário
- Escape de HTML para prevenir XSS
- Timeout em requisições de API
- Validação de respostas das APIs

## 🔧 Debug e Desenvolvimento

Em ambiente de desenvolvimento (localhost), ferramentas estão disponíveis:

```javascript
// Ver dados do formulário atual
debugApp.logFormData();

// Limpar formulário programaticamente
debugApp.clearForm();

// Obter dados não processados
debugApp.getFormData();

// Validar formulário atual
debugApp.validateForm(data);
```

## 🌐 Suporte de Localização

- **Cobertura global** - funciona em qualquer país
- **Geocodificação inteligente** - encontra localizações por nome
- **Coordenadas precisas** - latitude/longitude para consultas de API
- **Endereços formatados** - display name completo da localização

---

**🏢 Desenvolvido para o Sinquia Evertec Workshop**  
**🌬️ Promovendo consciência sobre qualidade do ar e saúde pública**  
**📍 Dados em tempo real de estações de monitoramento globais**
