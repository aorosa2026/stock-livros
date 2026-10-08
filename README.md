# Stock de Manuais

Página para registar a entrada de manuais escolares no stock, a partir do telemóvel
(leitura do código de barras ou pesquisa por ISBN/título).

## Como está montado

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

## Folhas da Google Sheet

- **Manuais (site)** — preenchida pelo menu *📚 Manuais → Atualizar do site do colégio*. Não editar à mão.
- **Leituras e outros** — PNL, inglês de leitura extensiva, pré-escolar… preenchida à mão.
- **Correções** — ISBN errados no site do colégio e o ISBN certo (aplicadas ao gerar a lista).
- **Lista** — gerada pelo menu *📚 Manuais → Gerar lista*. É a lista que a página usa.
- **Avisos** — problemas encontrados ao gerar a lista (❌ erro, 🧹 correção sem efeito, 🔎 verificar).
- **Movimentos** — cada entrada no stock (data, ISBN, parte, quantidade, quem registou).
- **Stock** — total por ISBN e parte (fórmula, não editar).
- **Config** — palavra-passe da página.

## Início de cada ano letivo

1. Na Sheet: *📚 Manuais → 1. Atualizar do site do colégio* → **Sim** para gerar a lista.
2. Atualizar a folha **Leituras e outros** com as leituras do novo ano.
3. *📚 Manuais → 2. Gerar lista* e rever a folha **Avisos**; corrigir ISBN errados na folha **Correções**.

## Se o link do Apps Script mudar

(acontece se for criada uma nova implementação, ou se a Sheet mudar de dono)

1. Apps Script → **Implementar → Gerir implementações** → copiar o URL que termina em `/exec`.
2. Neste repositório: abrir `index.html` → lápis ✏ → substituir o valor de `API_URL` (perto da linha 17) → **Commit changes**.

Para atualizar o código do Apps Script **sem** mudar o link: *Gerir implementações → ✏ → Versão: Nova versão*.
