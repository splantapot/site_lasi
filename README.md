# Site da LASI

Este repositório documenta e registra o código fonte do site da Liga Acadêmica de Sistemas Inteligentes (LASI) da Universidade Federal do Piauí (UFPI).

---

## Estrutura do Projeto

FALTA ATUALIZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR

```
SITE_LASI/
├── api/                     <-- Serviços do código Google Scripts
├── dev/
├── client/                  <-- Todo o desenvolvimento do Front-end (templates, css e js)
│   ├── css/
│   ├── js/
│   └── templates/
│       └── index.ejs
├── public/                  <-- Pasta de renderização (onde os arquivos renderizados ficam)
├── server/                  <-- Sistema de renderização com base em ejs
│   ├── src/                 
│   │   ├── classes/         
│   │   ├── path_util.js
│   │   ├── render.js
│   │   └── test_data.js
│   ├── build.js             <-- Executável de Build (para desenvolvimento)
│   └── run.js               <-- Executável principal (renderização final)
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Estrutura de estilos

Aqui colocarei como fiz os estilos do site, como sua estrutura funciona. Decidi refatorá-los para priorizar uma estrutura de classes mais bem definida, separando a responsabilidade dos arquivos css e js por componente (como Widgets).

---

Classe: é o nome da classe no css
Tipo: É o tipo de nomeclatura
Função: A função que desempenha

Tabela 1: Tipos de nomeclatura / Notação

Tipo    | Notação               |   Exemplo
01      | objetivo-alvo         |   l-main: layout do main
02      | elemento-x__especif   |   nav-bar__container: container do navbar

Tabela 2: Classes e funções

Classe          | Tipo  | Função
l-main          | 01    | estiliza a organização da tag main
nav-bar         | 02    | estiliza a navbar do site