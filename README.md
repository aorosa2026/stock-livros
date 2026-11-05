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

**Separadores da página:** 📥 Entradas e 📤 Saídas (ler vários livros seguidos para uma lista — o mesmo livro lido outra vez soma uma unidade —, confirmar e dar entrada ou retirar tudo do stock de uma vez; nas Entradas há também a leitura por foto e o registo de livros que não estão na lista), 📋 Por ano, 🕰 Antigas (edições antigas e PNL de outros anos). Tocar num livro abre a sua ficha numa janela: entrada/saída de um só livro, aprovação do professor, corrigir ou apagar registos. No cabeçalho: **🔄 Avaliar** (livros em stock que deixaram de estar na lista — classificar como PNL de outros anos ou manual de edição antiga e ver o identificador a escrever na lombada, ex. *PNL 25/26*, *EA 25/26*) e **👕 Fardas** (abre a app de atendimento das fardas).

**Sem rede:** os registos ficam guardados no telemóvel (aviso amarelo ⏳) e são enviados
sozinhos quando houver ligação. Cada registo tem um código único (coluna **ID** em
Movimentos), por isso um envio repetido nunca duplica linhas. Não apagar dados do browser
nem carregar em "sair" enquanto houver registos por enviar.

## Folhas da Google Sheet

- **Manuais (site)** — preenchida pelo menu *📚 Manuais → Atualizar do site do colégio*. Não editar à mão.
- **Leituras e outros** — PNL, inglês de leitura extensiva, pré-escolar… preenchida à mão.
- **Correções** — ISBN errados no site do colégio e o ISBN certo (aplicadas ao gerar a lista).
- **Lista** — gerada pelo menu *📚 Manuais → Gerar lista*. É a lista que a página usa.
- **Edições antigas** — livros registados pela página quando se lê um ISBN que não está na lista. Não é apagada pelas atualizações do site. Na página aparecem no separador **🕰 Antigas**. Coluna *Categoria* (L):
  - *Edição antiga* — edição anterior de um manual; coluna *Estado*: Por confirmar / Aprovado / Recusado (confirmação com o professor). Coluna F: livro da lista atual que o substituiu (opcional).
  - *PNL de outros anos* — livro que já foi PNL e pode voltar à lista.
  - Coluna *Último ano na lista* (M): último ano letivo em que o livro esteve na lista; dá o identificador da lombada (*PNL 25/26*, *EA 25/26*).
  - Os dados (colunas B–F e M) podem ser completados mais tarde: na página, ficha do livro → *Registo errado? Editar, corrigir ou apagar* → **✏ Editar dados**, ou diretamente na folha. Não mudar a coluna A (ISBN), que liga o livro ao stock.
  - Coluna *Stock* (K) é uma fórmula — não escrever por cima.
- **Avisos** — problemas encontrados ao gerar a lista (❌ erro, 🧹 correção sem efeito, 🔎 verificar).
- **Movimentos** — cada entrada ou saída (data, ISBN, parte, quantidade, quem registou, ID, Entrada/Saída). As saídas têm quantidade negativa.
- **Stock** — total por ISBN e parte (fórmula, não editar).
- **Histórico de listas** — a Lista de cada ano letivo, guardada sempre que se gera a lista (substitui a desse ano letivo e mantém os anteriores). É usada pelo 🔄 Avaliar para sugerir a disciplina e o último ano letivo de cada livro.
- **Config** — palavra-passe da página (B1) e ano letivo da lista atual (B3).

## Início de cada ano letivo

1. Na Sheet: *📚 Manuais → 1. Atualizar do site do colégio* → **Sim** para gerar a lista.
2. Atualizar a folha **Leituras e outros** com as leituras do novo ano.
3. *📚 Manuais → 2. Gerar lista*: confirmar o **ano letivo** da lista nova (fica guardada no Histórico de listas). Rever a folha **Avisos**; corrigir ISBN errados na folha **Correções**.
4. Na página, **🔄 Avaliar**: classificar os livros em stock que saíram da lista e escrever o identificador nas lombadas.

## Se o link do Apps Script mudar

(acontece se for criada uma nova implementação, ou se a Sheet mudar de dono)

1. Apps Script → **Implementar → Gerir implementações** → copiar o URL que termina em `/exec`.
2. Neste repositório: abrir `index.html` → lápis ✏ → substituir o valor de `API_URL` (perto da linha 17) → **Commit changes**.

Para atualizar o código do Apps Script **sem** mudar o link: *Gerir implementações → ✏ → Versão: Nova versão*.
