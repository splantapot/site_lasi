# Site da LASI

Este repositório documenta e registra o código fonte do site da Liga Acadêmica de Sistemas Inteligentes (LASI) da Universidade Federal do Piauí (UFPI).

---

## Estrutura do Projeto

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