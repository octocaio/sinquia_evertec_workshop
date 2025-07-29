# Page snapshot

```yaml
- banner:
  - heading "🌍 Consulta de Qualidade do Ar" [level=1]
  - paragraph: Insira a localização para verificar a qualidade do ar
- main:
  - text: Cidade *
  - textbox "Cidade *": CidadeQueNaoExiste123
  - text: A cidade deve conter apenas letras e espaços Estado/Província/Região *
  - textbox "Estado/Província/Região *": XX
  - text: País
  - textbox "País": PaisInexistente
  - text: Se não informado, assumiremos EUA como país padrão
  - button "Consultar Qualidade do Ar"
- contentinfo:
  - paragraph: Workshop Sinquia Evertec - Aplicativo de Qualidade do Ar
```