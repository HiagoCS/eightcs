# Vitrine Digital

### eight.cs Development

## Sumário

- [1. Apresentação](#1-apresentação)
- [2. Funcionalidades](#2-funcionalidades)

- [3. Componentes do Site](#3-componentes-do-site)
- [4. Banner](#4-banner)
- [5. Home](#5-home)
- [6. Projetos](#6-projetos)
- [7. Contatos](#7-contatos)

- [8. Encerramento](#8-encerramento)

- [9. Instalação](#9-instalação)
  - [9.1 Instalar as dependências](#91-instalar-as-dependências)
  - [9.2 Configurar as seeds do banco](#92-configurar-as-seeds-do-banco)
  - [9.3 Inserir as seeds no banco](#93-inserir-as-seeds-no-banco)
  - [9.4 Adicionar imagens](#94-adicionar-imagens)
  - [9.5 Executar a Vitrine](#95-executar-a-vitrine)
- [10. Tecnologias](#10-tecnologias)

---

## 1. Apresentação

### O que é a Vitrine Digital?

A **Vitrine Digital**, desenvolvida pela **eight.cs Development**, é uma solução para empresas e profissionais que desejam **apresentar seus serviços de forma organizada, moderna e profissional na internet**.

A proposta é simples: reunir apresentação, serviços, projetos e contatos em um único espaço digital.

---

## 2. Funcionalidades

### Site SPA

A Vitrine Digital utiliza o conceito de **Single Page Application (SPA)**, permitindo navegar pelas principais áreas do site sem carregar uma nova página a cada interação.

O resultado é uma navegação mais **rápida, fluida e agradável**.

### Indexação dos projetos

Os projetos e serviços podem ser **organizados individualmente por categorias**, facilitando a navegação e permitindo que cada conteúdo seja encontrado de forma estruturada.

Os dois recursos trabalham juntos:

**Home → visão geral dos serviços**  
**Menu → acesso organizado a cada categoria**

---

## 3. Componentes do Site

A Vitrine Digital é composta por quatro áreas principais:

| Componente | Função |
|---|---|
| **Banner** | Apresenta a identidade da empresa. |
| **Home** | Faz a apresentação inicial dos serviços. |
| **Projetos** | Organiza e apresenta serviços e trabalhos. |
| **Contatos** | Reúne os principais meios de contato. |

---

## 4. Banner

### A identidade da sua empresa

Localizado no topo do site, o banner apresenta o **nome da empresa ou profissional** e funciona como a identificação visual imediata da Vitrine Digital.

---

## 5. Home

### A primeira impressão

A Home é a área principal da Vitrine Digital.

Ela apresenta um **banner central**, uma breve descrição dos serviços e uma visão geral dos projetos.

A ideia é responder rapidamente:

**Quem é você?**  
**O que você oferece?**

---

## 6. Projetos

### Seus serviços organizados

Os projetos são organizados por meio de um **menu dinâmico**, permitindo separar serviços e trabalhos em diferentes categorias.

A Home apresenta uma visão geral, enquanto o menu permite acessar cada tópico de forma organizada.

**Home → visão geral**  
**Menu → detalhamento por categoria**

---

## 7. Contatos

### Facilite o próximo passo

A área de contatos reúne as principais informações para que o visitante possa entrar em contato ou localizar a empresa.

Podem ser apresentados:

**Telefone · E-mail · Redes sociais · Endereço**

Tudo em um único lugar.

---

## 8. Encerramento

### Sua empresa apresentada de forma simples e profissional

A Vitrine Digital reúne **apresentação, serviços, projetos e contatos** em uma única experiência digital.

**Mostre o que você faz.**  
**Organize seus serviços.**  
**Facilite o contato com seus clientes.**

### eight.cs Development

**Tecnologia para apresentar o seu trabalho.**

---

# 9. Instalação

## 9.1 Instalar as dependências

Na raiz do projeto, execute:

```bash
npm run install:all
```

Esse comando instala as dependências da **raiz**, do **backend** e do **frontend**.

<details>
<summary><strong>Dependências da raiz</strong></summary>

### dependencies

- `@fastify/static` — `^10.1.4`
- `dep` — `^1.5.8`

### devDependencies

- `concurrently` — `^9.2.1`
- `rimraf` — `^6.1.3`

</details>

<details>
<summary><strong>Dependências do backend</strong></summary>

### dependencies

- `@fastify/cors` — `^11.3.0`
- `@fastify/static` — `^10.1.4`
- `dotenv` — `^18.0.3`
- `drizzle-orm` — `^1.0.0-rc.4`
- `eightcs_profile` — `file:..`
- `fastify` — `^5.12.1`
- `tsx` — `^4.23.12`
- `typescript` — `^7.0.2`

### devDependencies

- `@types/node` — `^26.6.2`
- `drizzle-kit` — `^1.0.0-rc.4`

</details>

<details>
<summary><strong>Dependências do frontend</strong></summary>

### dependencies

- `@tanstack/react-query` — `^5.102.3`
- `eightcs_profile` — `file:..`
- `react` — `^19.2.7`
- `react-dom` — `^19.2.7`
- `react-router-dom` — `^7.18.1`
- `tanstack` — `^2.0.3`

### devDependencies

- `@types/node` — `^22.20.3`
- `@types/react` — `^19.2.17`
- `@types/react-dom` — `^19.2.3`
- `@vitejs/plugin-react` — `^6.0.3`
- `oxlint` — `^1.71.0`
- `sass` — `^1.102.0`
- `terser` — `^5.51.2`
- `vite` — `^8.1.1`
- `vite-plugin-svgr` — `^5.2.0`
- `vite-tsconfig-paths` — `^6.1.1`

</details>

---

## 9.2 Configurar as seeds do banco

As seeds podem ser configuradas manualmente em:

```text
./backend/src/db/seeds/
```

Ou pelo configurador:

```bash
npm run setup
```

O `setup.js` coleta os dados da Vitrine Digital, organiza categorias, páginas, projetos, modais e cards e, ao final, reescreve as seeds do backend.

---

## 9.3 Inserir as seeds no banco

Depois de configurar as seeds, execute:

```bash
npm run db:init
```

Esse comando insere os dados das seeds no banco SQLite.

---

## 9.4 Adicionar imagens

Com o banco configurado, adicione as imagens dos projetos seguindo esta estrutura:

```text
ID_DO_PROJETO/
├── imagem-geral-1.png
├── imagem-geral-2.jpg
└── modal/
    ├── 1.png
    ├── 2.png
    └── 3.png
```

A pasta principal contém as **imagens gerais exibidas nos cards**.

A pasta:

```text
ID_DO_PROJETO/modal/
```

contém as imagens utilizadas pelos **modais**, quando o projeto possuir esse recurso.

### Regras das imagens

**Imagens gerais**

- Não precisam seguir uma regra específica de nome.
- Todas as imagens válidas encontradas na pasta são consideradas.

**Imagens de modal**

- Devem começar com um **identificador numérico**.
- Devem utilizar a extensão definida no cadastro do modal.
- A numeração determina a ordem das imagens.
- A numeração não precisa corresponder ao `id` do modal no banco.

Para a organização manual, o diretório de armazenamento utilizado pelo projeto é:

```text
./backend/storage/img/
```

Também é possível utilizar o utilitário:

```bash
npm run setup:images
```

### O que o `images.js` faz?

O `images.js` automatiza a associação entre os **projetos cadastrados** e suas pastas de imagens.

Durante o processamento, ele:

1. verifica `./config/projetos/`;
2. permite associar uma pasta a cada projeto;
3. verifica se existe pelo menos uma imagem geral;
4. consulta o banco para descobrir quantos modais existem em cada projeto;
5. compara essa quantidade com as imagens encontradas em `/modal/`;
6. verifica se os nomes das imagens de modal começam com um identificador numérico;
7. registra o resultado em `ImagesRegister`;
8. copia somente os projetos aprovados para o armazenamento do backend.

As imagens de origem não são movidas nem apagadas durante o processamento normal.

---

## 9.5 Executar a Vitrine

Depois de concluir todas as etapas, execute:

```bash
npm run dev
```

Esse comando inicia o ambiente de desenvolvimento.

### Configuração da API

Crie o arquivo:

```text
./frontend/.env
```

com:

```env
VITE_API_URL=http://URL_DO_BACKEND
```

Em um ambiente local, o endereço do backend pode seguir este padrão:

```text
http://localhost:3000
```

ou:

```text
http://SEU_IP:3000
```

O endereço final e as portas utilizadas são definidos pela configuração do ambiente e serão informados pelo comando de desenvolvimento.

---

# 10. Tecnologias

### Backend

**Node.js + Fastify + Drizzle ORM + SQLite + TypeScript**

### Frontend

**React + React DOM + React Router + Vite + Sass + TanStack Query**

---
