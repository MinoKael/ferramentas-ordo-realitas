# Ferramentas da Ordo Realitas

Hub de utilidades de mesa para Ordem Paranormal 2, publicado como site estático no GitHub Pages.

## Estrutura

```
index.html                                  home, lista as ferramentas
assets/site.css                             tokens e estilos da casca (home, cabeçalho, rodapé)
assets/analytics.js                         Google Analytics; o ID de medição mora só aqui
assets/fonts/                               as fontes dos sigilos (origem dos blocos base64)
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
| Tradutor de Sigilos | `ferramentas/tradutor-de-sigilos/` | pronta |

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

### Tradutor de Sigilos

Duas escritas, com naturezas diferentes:

- **Sigilos do Outro Lado** — cifra de substituição, uma letra por desenho. A tradução é exata nos
  dois sentidos: escrever é digitar; ler é achar o desenho no alfabeto da página e clicar, que a
  letra entra no texto. O modo *esconder letras* transforma o alfabeto em treino de leitura.
- **Sinais do Estrangeiro** — a mesma fonte serve de dois jeitos, e a aba tem um modo para cada um:

  - **Composição** (uso interpretativo): cada sinal é um conceito inteiro e a leitura não é um
    conceito depois do outro — os sinais se encaixam *dentro* de uma estrutura, como radicais dentro
    de um kanji, e o desenho todo é que diz a ideia. Escolhida a moldura (círculo, quadrado,
    hexágono, losango, triângulo), os conceitos escritos no campo entram no vão dela; o arranjo é
    automático por quantidade, com *em linha* e *empilhado* à mão. A imagem exportada é o quadrado
    da composição, sem moldura de papel.
  - **Cifra** (uso de substituição): os sinais valendo por letras do alfabeto latino. Cada alheio
    embaralha a chave do seu jeito, então o **nome do alheio** é a semente de um embaralhamento
    determinístico — o mesmo nome devolve sempre a mesma chave, e dá para anotar na ficha do NPC.
    Sem nome, a chave é direta. **Exportar a chave** gera a folha 6×6 de decifrar para a mesa.

  Como a composição não é tradução palavra a palavra, ela se apoia num **dicionário de conceitos
  editável**.

Sobre esse dicionário: a fonte traz 47 sinais e o arquivo não diz que conceito cada desenho carrega,
então o pareamento é leitura da folha de referência, conferida à mão. Hoje 31 sinais têm conceito e
16 não (`G L O Q R U W Y` e os algarismos, menos o `0` e o `2`) — esses existem na fonte e saem pelo
`[tecla]`, só não são chamados por palavra nenhuma. Corrigir é clicar no significado do verbete —
fica salvo no `localStorage`. O botão **Exportar dicionário** gera o JSON para embutir como padrão em
`SINAIS_PADRAO`; ao fazer isso, suba o `DIC_V`, senão a cópia salva no navegador de quem já usou a
página continua por cima do padrão novo.

Duas regras do compositor que valem saber: palavra de uma letra só casa escrita igualzinha, com
acento e tudo, para separar o `é` (ser/estar) do `e` de ligação — que, sendo ligação e não conceito,
some calado em vez de virar sinal. E quando dois sinais dividem o mesmo conceito (`E` e `Z` dividem
*origem, fonte*), quem sai pelo texto é o primeiro da lista; o outro vem pelo `[Z]` ou pelo catálogo.

As duas fontes ficam em `assets/fonts/` e vão **embutidas em base64** na página, pelo mesmo motivo
do editor de cartões: a imagem exportada é um SVG e, depois de gerada, não busca mais nada na rede —
sem as fontes dentro dela, o handout sairia com letras latinas no lugar dos sigilos. A página foi
gerada uma vez a partir de partes e agora se edita direto; para trocar as fontes, regere os blocos
`@font-face` de `<style id="fontesigilos">`.

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
| `exportar_sigilos` | ao exportar no tradutor | `escrita` (sigilos/sinais), `formato`, `escala` |

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
