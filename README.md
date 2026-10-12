# Stock de Manuais e Fardas

Duas páginas para usar no telemóvel, cada uma ligada à sua Google Sheet:

| Página | Para quê |
|---|---|
| [`index.html`](#-stock-de-manuais-indexhtml) | **Stock de Manuais**: entrada e saída de manuais escolares (código de barras ou pesquisa por ISBN/título) |
| [`fardas.html`](#-stock-de-fardas-fardashtml) | **Stock de Fardas**: inventário do banco de fardas (QR ou pesquisa) e calculadora |

Endereços (GitHub Pages):
- Manuais: `https://<utilizador>.github.io/<repositório>/`
- Fardas: `https://<utilizador>.github.io/<repositório>/fardas.html`

---

## 📚 Stock de Manuais (`index.html`)

Página para registar a entrada de manuais escolares no stock, a partir do telemóvel
(leitura do código de barras ou pesquisa por ISBN/título).

### Como está montado

| Peça | Onde está | Para quê |
|---|---|---|
| `index.html` | este repositório (GitHub Pages) | a página usada no telemóvel |
| `sw.js` | este repositório | guarda uma cópia da página no telemóvel para abrir sem rede |
| Google Sheet **Inventário de Livros** | Google Drive | lista de manuais, correções, movimentos e stock |
| Apps Script (dentro da Sheet) | Extensões → Apps Script | extrai a lista do site do colégio e recebe os registos da página |

A página lê e grava tudo na Google Sheet através do Apps Script, e só funciona com a
palavra-passe definida na folha **Config** (célula B1).

**Sem rede:** os registos ficam guardados no telemóvel (aviso amarelo ⏳) e são enviados
sozinhos quando houver ligação. Cada registo tem um código único (coluna **ID** em
Movimentos), por isso um envio repetido nunca duplica linhas. Não apagar dados do browser
nem carregar em "sair" enquanto houver registos por enviar.

### Folhas da Google Sheet

- **Manuais (site)** — preenchida pelo menu *📚 Manuais → Atualizar do site do colégio*. Não editar à mão.
- **Leituras e outros** — PNL, inglês de leitura extensiva, pré-escolar… preenchida à mão.
- **Correções** — ISBN errados no site do colégio e o ISBN certo (aplicadas ao gerar a lista).
- **Lista** — gerada pelo menu *📚 Manuais → Gerar lista*. É a lista que a página usa.
- **Edições antigas** — livros com ISBN de edições anteriores, registados pela página quando se lê um ISBN que não está na lista. Coluna *Estado*: Por confirmar / Aprovado / Recusado (confirmação com o professor). Não é apagada pelas atualizações do site. Na página aparecem no separador **🕰 Antigas**.
- **Avisos** — problemas encontrados ao gerar a lista (❌ erro, 🧹 correção sem efeito, 🔎 verificar).
- **Movimentos** — cada entrada ou saída (data, ISBN, parte, quantidade, quem registou, ID, Entrada/Saída). As saídas têm quantidade negativa.
- **Stock** — total por ISBN e parte (fórmula, não editar).
- **Config** — palavra-passe da página.

### Início de cada ano letivo

1. Na Sheet: *📚 Manuais → 1. Atualizar do site do colégio* → **Sim** para gerar a lista.
2. Atualizar a folha **Leituras e outros** com as leituras do novo ano.
3. *📚 Manuais → 2. Gerar lista* e rever a folha **Avisos**; corrigir ISBN errados na folha **Correções**.

---

## 👕 Stock de Fardas (`fardas.html`)

Inventário do banco de fardas: leitura de QR, pesquisa, entradas e saídas de stock, e calculadora.

### Como está montado

| Peça | Onde está | Para quê |
|---|---|---|
| `fardas.html` | este repositório (GitHub Pages) | a página usada no telemóvel |
| Google Sheet das fardas | Google Drive | lista de artigos, stock e movimentos |
| Apps Script (dentro da Sheet) — `Codigo.gs` | Extensões → Apps Script | envia a lista à página e grava as entradas/saídas |
| Apps Script da **calculadora** | projeto independente (script.google.com → Os meus projetos) | aparece no separador 🧮 Calculadora |

A página só funciona com a palavra-passe definida no Apps Script das fardas:
**⚙ Definições do projeto → Propriedades do script → `PASSWORD`**.
Pode ser mudada aí a qualquer momento, sem nova implementação.

### O que a página faz

- Lê QR em direto ou por foto. O QR pode ter só o `id` (ex.: `UNI-POLO-MC-8`) ou um link `…/fardas.html?id=UNI-POLO-MC-8`, que também abre a ficha com a câmara normal do telemóvel.
- Pesquisa por letras (ignora acentos) e filtros em cascata: **categoria → tipo de peça → tamanho**.
- Ficha de cada artigo com o stock atual e botões **+ Entrada** / **− Saída**, com motivo opcional (Doação, Troca, Venda, Acerto).
- Separador **🧮 Calculadora** com a calculadora (link em `CALC_URL`).

### Folhas da Google Sheet

- **Artigos** — uma linha por peça e tamanho: `id | categoria | subcategoria | tamanho | descricao | stock`.
  - O `id` tem de ser **exatamente** o texto que está dentro do QR.
  - A coluna `stock` é atualizada pela página; só corrigir à mão em caso de contagem.
  - Categorias usadas: Uniforme, Ginástica, Outros. A subcategoria é o tipo de peça (Polo manga curta, Saia, Sapatilhas…).
- **Movimentos** — registo automático de cada entrada e saída (data, quem, id, artigo, movimento, stock depois, motivo). As saídas têm quantidade negativa.

### Primeira configuração

1. Na Sheet: Extensões → Apps Script → colar `Codigo.gs` → executar a função `configurar` uma vez (cria as folhas com exemplos).
2. ⚙ Definições do projeto → Propriedades do script → adicionar `PASSWORD`.
3. Implementar → Nova implementação → Aplicação Web (Executar como: Eu · Quem tem acesso: Qualquer pessoa).
4. Copiar o link `/exec` para `API_URL` no `fardas.html` (perto da linha 18).

### Calculadora

- O link está em `CALC_URL` no `fardas.html` (perto da linha 19).
- Para aparecer dentro da página, o `doGet` da calculadora tem de ter
  `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` (já tem).
- Se o separador ficar em branco, usar o link "Abrir a calculadora numa janela à parte".

---

## Se o link de um Apps Script mudar

(acontece se for criada uma nova implementação, ou se a Sheet mudar de dono)

1. Apps Script → **Implementar → Gerir implementações** → copiar o URL que termina em `/exec`.
2. Neste repositório: abrir o ficheiro certo → lápis ✏ → substituir o valor → **Commit changes**.
   - Manuais: `API_URL` no `index.html`
   - Fardas: `API_URL` no `fardas.html`
   - Calculadora: `CALC_URL` no `fardas.html`

Para atualizar o código de um Apps Script **sem** mudar o link: *Gerir implementações → ✏ → Versão: Nova versão*.
