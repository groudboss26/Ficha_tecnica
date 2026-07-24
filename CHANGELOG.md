# 📋 CHANGELOG — Receitas Verdemar

Todas as mudanças notáveis deste projeto serão documentadas aqui.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

> **Como versionar?**
> - `MAJOR` (X.0.0) — mudanças incompatíveis ou redesign completo
> - `MINOR` (0.X.0) — novas funcionalidades adicionadas de forma retrocompatível
> - `PATCH` (0.0.X) — correções de bugs e ajustes menores

---

## [Não lançado]

> Use esta seção para registrar o que está sendo desenvolvido antes de um release oficial.

### Em progresso
- [ ] Exportar/imprimir receita já calculada (útil para colar na estação de trabalho)
- [ ] Editor simples (formulário) para adicionar/editar receitas sem mexer no código

---

## [1.8.0] — 2026-07-23

### Adicionado
- **Modo claro/escuro** com botão 🌙/☀️ no topbar. A preferência é salva em `localStorage` e aplicada imediatamente ao carregar a página (sem flash de cor errada)
- Paleta clara baseada em tons papel/creme aquecido (`#f2ede0`) mantendo a identidade visual da peixaria
- Todas as cores de categoria (`--wasabi`, `--amber`, `--sea`, `--coral`) ajustadas para contraste adequado no tema claro

---

## [1.7.1] — 2026-07-23

### Corrigido
- **Toast não animava** — substituída a abordagem `:not([hidden])` por classe `.update-toast--visible` adicionada via `double requestAnimationFrame`, garantindo que o browser pinte o estado inicial (`opacity:0`) antes de iniciar a transição
- **Race condition no SW** — adicionada função `trackInstalling()` e verificação de `reg.installing` logo após o `.register()`, evitando que atualizações rápidas passassem despercebidas
- **Cache do `sw.js`** — adicionada opção `{ updateViaCache: 'none' }` ao registro, forçando o browser a sempre buscar o arquivo sem depender do cache HTTP

---

## [1.7.0] — 2026-07-23

### Adicionado
- **Notificação de atualização PWA** — quando uma nova versão do app estiver disponível, um toast aparece na parte inferior da tela com o botão **Atualizar**. Ao clicar, o novo Service Worker assume o controle e a página recarrega automaticamente com a versão mais recente
- Botão **✕** no toast para dispensar o aviso sem atualizar

### Alterado
- `sw.js` atualizado para `receitas-verdemar-v2` — removido o `skipWaiting()` automático do evento `install`; o SW agora aguarda autorização da página via mensagem `{ type: 'SKIP_WAITING' }` antes de ativar

---

## [1.6.1] — 2026-07-23

### Corrigido
- **Busca insensível a acentos** — adicionada função `normalizeText()` que aplica `NFD` + remoção de diacíticos. Agora `acucar` encontra `açúcar`, `salmao` encontra `salmão`, `shoyu` encontra `shoyu`, etc. Aplicado tanto no índice quanto na query do usuário

---

## [1.6.0] — 2026-07-23

### Melhorado
- **Índice de busca pré-computado** (`SEARCH_INDEX_MAP`) — textos de nome e ingredientes são normalizados para lowercase uma única vez na carga da página, eliminando chamadas repetidas a `toLowerCase()` a cada keystroke
- **Debounce de 150 ms** no evento `input` da barra de busca — impede que `renderList()` seja chamado a cada tecla digitada, reduzindo renderizações desnecessárias do DOM
- **Agrupamento por categoria com `Map`** em passagem única — substituído o `double-filter` (`.filter()` para `catsToShow` + `.filter()` para `items`) por um `groupMap` percorrido uma só vez, reduzindo iterações sobre o array de receitas

---



### Alterado
- Categoria **"Molhos Base"** renomeada para **"Molhos de Acompanhamento"** em `script.js` (`CATEGORIES`)
- **Molho Tarê** migrado da categoria "Molhos para Arroz" (`arroz`) para "Molhos de Acompanhamento" (`base`)

---


## [1.4.0] — 2026-07-23

### Adicionado
- Modo Cozinha (Checklist) estendido para ingredientes — agora é possível riscar ingredientes conforme são separados, além das etapas do preparo
- Deep links por receita via hash router (`index.html#tare`, etc.) — permite compartilhar receitas diretamente pelo WhatsApp
- Sistema de favoritos persistido via `localStorage` — receitas favoritadas ficam fixas no topo ou filtradas pelo chip "⭐ Favoritas"
- Barra de busca em tempo real por nome e ingredientes

### Alterado
- Modal migrado da implementação customizada para a tag HTML5 nativa `<dialog>`, garantindo retenção de foco automática (acessibilidade)
- No mobile, o modal exibe como bottom sheet; em telas >= 720 px, como card flutuante centralizado

---

## [1.3.0] — Data a preencher

### Adicionado
- Atalhos de multiplicadores rápidos no painel de escala (`0.5x`, `1x`, `2x`, `3x`, `5x`)
- Botões de ajuste fino com passos inteligentes adaptados à unidade (`±100g`, `±1kg`, `±1x`)
- Campo de observação (`observacao`) no modelo de dados para reproduzir notas do documento original

### Corrigido
- Arredondamento de itens `discrete` (ovos, limões, pacotes) para múltiplos de `0.5` unidade

---

## [1.2.0] — Data a preencher

### Adicionado
- Filtros por categoria em chips (Molhos Base, Molhos para Arroz, Molhos Diversos, Recheios & Massas)
- Suporte a dois tipos de escala: `weight` (por ingrediente principal) e `multiplier` (multiplicador de lote)
- Campo `nota` no modelo de dados para sinalizar suposições/assunções feitas na transcrição

### Alterado
- Paleta de cores definida com design tokens (`:root` em `style.css`): `--wasabi`, `--amber`, `--sea`, `--coral`
- Tipografia: `Space Grotesk` (títulos), `Inter` (corpo), `IBM Plex Mono` (números calculados)

---

## [1.1.0] — Data a preencher

### Adicionado
- Calculadora de produção: o usuário informa quantidade e os ingredientes são reescalonados proporcionalmente
- Medidas padrão originais exibidas como estão no documento fonte (campo `medidasPadrao`)
- Service Worker (`sw.js`) com estratégia stale-while-revalidate para suporte offline
- Manifesto PWA (`manifest.json`) — app instalável na tela inicial do celular

---

## [1.0.0] — Data a preencher

### Adicionado
- Estrutura inicial do projeto: `index.html`, `style.css`, `script.js`
- Array `RECIPES` com as primeiras receitas transcritas das fichas técnicas da Peixaria Verdemar
- Layout mobile-first com breakpoints em `720px` e `960px`
- Tema escuro ("nori") como tema único
- Renderização dinâmica da lista e modal de receitas a partir do array `RECIPES` — sem editar HTML

---

## 📌 Guia de contribuição para este arquivo

Ao realizar qualquer atualização no projeto, **abra este arquivo e registre a mudança** antes de publicar.

### Tipos de entrada

| Tipo | Quando usar |
|---|---|
| `Adicionado` | Nova funcionalidade ou receita incluída |
| `Alterado` | Mudança em funcionalidade já existente |
| `Removido` | Funcionalidade, receita ou arquivo excluído |
| `Corrigido` | Correção de bug ou dado incorreto |
| `Segurança` | Correção de vulnerabilidade |
| `Dados` | Correção ou adição de dados das receitas (ingredientes, quantidades, preparo) |

### Fluxo recomendado

1. Faça suas alterações no código/dados
2. Abra o `CHANGELOG.md`
3. Adicione uma entrada em **[Não lançado]** descrevendo a mudança
4. Quando for publicar uma versão, mova as entradas de **[Não lançado]** para uma nova seção `## [X.Y.Z] — AAAA-MM-DD`
5. Deixe a seção **[Não lançado]** vazia (mas presente) para o próximo ciclo

### Exemplo de entrada

```markdown
## [1.5.0] — 2026-08-01

### Dados
- Adicionada receita: Molho Ponzu (categoria: Molhos Base)
- Corrigido valor de referência do Molho Tarê: de `12` para `15`

### Adicionado
- Chip de filtro "Recentes" para destacar receitas adicionadas nos últimos 30 dias
```
