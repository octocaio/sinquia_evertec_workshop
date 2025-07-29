# Aplicação Web de Verificação da Qualidade do Ar

Uma aplicação web simples para consultar a qualidade do ar baseada na localização do usuário.

## 🚀 Como Executar

1. Abra o arquivo `index.html` em seu navegador web
2. Ou use um servidor local simples:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (se tiver http-server instalado)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

## 📋 Funcionalidades

### ✅ Implementado (Fase 2 - Completa)
- ✅ Formulário com campos para cidade, estado e país
- ✅ Validação básica do lado cliente
- ✅ Interface responsiva e acessível
- ✅ País padrão (EUA) quando não especificado
- ✅ **Integração com API de geocodificação (Nominatim)**
- ✅ **Integração com API de qualidade do ar (Open-Meteo)**
- ✅ **Exibição de IQA (Europeu e Americano)**
- ✅ **Dados detalhados de poluentes (PM10, PM2.5, CO, NO₂, SO₂, O₃)**
- ✅ **Identificação do poluente principal**
- ✅ **Avisos de saúde baseados no nível de IQA**
- ✅ **Tratamento robusto de erros de API**
- ✅ **Horário e fuso horário das medições**

### 🔄 Próximas Fases Opcionais
- 🔄 Testes unitários e de integração
- 🔄 Histórico de buscas
- 🔄 Localizações favoritas
- 🔄 Comparação entre cidades
- 🔄 Integração com mapas

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização responsiva com gradientes e animações
- **JavaScript (ES6+)** - Lógica de validação e integração com APIs
- **APIs Externas:**
  - **Nominatim API** - Geocodificação (conversão de endereços em coordenadas)
  - **Open-Meteo Air Quality API** - Dados de qualidade do ar em tempo real

## 📱 Características

### Interface
- Design moderno com gradientes
- Formulário intuitivo e acessível
- Feedback visual para validação
- Responsivo para dispositivos móveis
- **Exibição visual do IQA com código de cores**
- **Dashboard de poluentes com destaque do principal**

### Validação
- Campos obrigatórios: cidade e estado
- Validação de comprimento mínimo
- Feedback em tempo real
- Mensagens de erro contextuais

### APIs e Dados
- **Geocodificação automática** via Nominatim
- **Dados de qualidade do ar em tempo real** via Open-Meteo
- **Suporte a IQA Europeu e Americano**
- **6 tipos de poluentes monitorados**
- **Identificação automática do poluente principal**
- **Avisos de saúde contextuais**

### UX/UI
- Estados visuais para campos (erro/sucesso)
- Botão com estado de carregamento
- Scrolling suave para resultados
- Animações e transições fluidas
- **Círculo colorido do IQA**
- **Cards informativos dos poluentes**
- **Tratamento elegante de erros**

## 📁 Estrutura do Projeto

```
air-quality-app/
├── index.html      # Estrutura principal da aplicação
├── styles.css      # Estilos e layout responsivo
├── script.js       # Lógica JavaScript e validações
└── README.md       # Documentação do projeto
```

## 🎯 Como Usar

1. **Preencha os campos obrigatórios:**
   - Cidade (obrigatório)
   - Estado/Província/Região (obrigatório)
   - País (opcional - padrão: EUA)

2. **Clique em "Verificar Qualidade do Ar"**

3. **Veja os resultados detalhados:**
   - **IQA atual** com código de cores e descrição
   - **Níveis de poluentes** (PM10, PM2.5, CO, NO₂, SO₂, O₃)
   - **Poluente principal** destacado
   - **Avisos de saúde** baseados no IQA
   - **Data e horário** da última medição

## 🔧 Desenvolvimento

### Próximos Passos
Para continuar o desenvolvimento e adicionar funcionalidade de API:

1. Implementar geocodificação com Nominatim
2. Integrar API Open-Meteo para dados de qualidade do ar
3. Adicionar tratamento de erros
4. Implementar cache de resultados
5. Adicionar testes automatizados

### Debug
O aplicativo inclui utilitários de debug disponíveis no console:
```javascript
// Acessar dados do formulário
appDebug.getFormData()

// Testar validação
appDebug.validateForm()

// Limpar mensagens
appDebug.clearMessages()
```

## 🌟 Workshop Sinquia Evertec

Este projeto faz parte do workshop de desenvolvimento web da Sinquia Evertec, demonstrando:
- Desenvolvimento frontend moderno
- Integração com APIs REST públicas
- Validação de formulários
- Design responsivo
- Tratamento de erros
- Boas práticas de UX/UI
- Exibição de dados científicos de forma acessível

### 🎯 **Funcionalidades Principais da Aplicação Completa:**

1. **📍 Geocodificação Inteligente**
   - Converte endereços em coordenadas geográficas
   - Suporte a diferentes formatos de localização
   - Feedback detalhado da localização encontrada

2. **🌬️ Dados de Qualidade do Ar em Tempo Real**
   - IQA Europeu e Americano
   - 6 poluentes principais monitorados
   - Identificação automática do poluente mais crítico

3. **💡 Avisos de Saúde Contextuais**
   - Recomendações baseadas no nível de IQA
   - Orientações específicas para grupos sensíveis
   - Códigos de cores intuitivos

4. **🔧 Arquitetura Robusta**
   - Tratamento elegante de erros
   - Estados de carregamento
   - Design responsivo
   - Código organizado e manutenível

---

**Desenvolvido para o Workshop Sinquia Evertec** 🚀
