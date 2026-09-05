# Ferramentas da Ordo Realitas

Hub de utilidades de mesa para Ordem Paranormal 2, publicado como site estático no GitHub Pages.

## Estrutura

```
index.html                                  home, lista as ferramentas
assets/site.css                             tokens e estilos da casca (home, cabeçalho, rodapé)
assets/analytics.js                         Google Analytics; o ID de medição mora só aqui
ferramentas/<nome-da-ferramenta>/index.html uma pasta por ferramenta, URL limpa
.nojekyll                                   impede o Jekyll de ignorar pastas iniciadas por _
```

Cada ferramenta é **autocontida**: traz o próprio CSS e JS no mesmo arquivo e não depende do
`assets/site.css`. Assim dá para abrir uma ferramenta direto do disco (duplo clique) sem servidor,
e mexer numa sem risco de quebrar as outras. O preço é repetir alguns estilos — combinado.
A única referência externa de uma ferramenta é a linha do analytics.

## Ferramentas

| Ferramenta | Pasta | Estado |
| --- | --- | --- |
| Pontos de Interesse | `ferramentas/pontos-de-interesse/` | pronta |
| Tradutor de Sigilos | — | em construção |

### Pontos de Interesse

Editor de cartões de ponto de interesse no layout dos módulos oficiais. Salva no `localStorage`,
importa e exporta JSON, e gera imagem de cada cartão em PNG de alta resolução ou SVG vetorial.

As fontes (Oswald, Roboto e Roboto Mono, subset latin) estão embutidas em base64 no próprio HTML —
por isso o arquivo passa de 500 KB. Não é desperdício: a exportação monta um SVG com
`foreignObject`, e uma imagem já gerada não busca nada na rede; sem as fontes embutidas o cartão
exportado sairia com tipos substitutos. O script que baixa e converte as fontes fica fora do repo;
para trocá-las, gere um novo bloco `<style id="fontdata">`.

## Rodar localmente

Abrir `index.html` no navegador já funciona. Se quiser navegar entre as páginas como no site
publicado, sirva a pasta:

```bash
python -m http.server 8000
```

## Analytics

HTML estático não herda `<head>`, e o `.nojekyll` desliga qualquer include — então **cada página
precisa carregar a tag**. Em vez de repetir o bloco do Google, cada uma traz uma linha só:

```html
<script defer src="assets/analytics.js"></script>          <!-- na raiz -->
<script defer src="../../assets/analytics.js"></script>    <!-- dentro de uma ferramenta -->
```

O ID de medição fica em `assets/analytics.js`. Aberto do disco (`file://`) o script não faz nada:
a requisição falharia de qualquer forma e as ferramentas precisam rodar offline.

### Eventos

O editor de Pontos de Interesse dispara, além do `page_view` automático do GA4:

| Evento | Quando | Parâmetros |
| --- | --- | --- |
| `exportar_imagem` | ao terminar a exportação | `formato` (png/svg), `escala`, `quantidade`, `falhas` |
| `exportar_json` | ao baixar ou copiar o JSON | `acao` (baixar/copiar), `cartoes` |

O disparo passa por `evento()`, que confere se o `gtag` existe — sem ele (arquivo local, bloqueador
de anúncios) a ferramenta funciona igual. Para os parâmetros aparecerem nos relatórios, registre
cada um como dimensão personalizada no painel do GA4.

## Publicar no GitHub Pages

Em **Settings → Pages**, aponte para a branch `main` e a pasta `/ (root)`. Os caminhos são todos
relativos, então funciona tanto em `usuario.github.io` quanto em `usuario.github.io/repositorio/`.

## Adicionar uma ferramenta nova

1. Crie `ferramentas/<nome>/index.html` — autocontido, em português, `lang="pt-BR"`.
2. Inclua o link de volta para o hub no topo (`<a class="voltar" href="../../index.html">←</a>`)
   e a linha do analytics no `<head>`.
3. Acrescente uma ficha em `index.html`.

---

Projeto de fã, sem vínculo com a produção oficial de Ordem Paranormal.
