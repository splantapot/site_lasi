class PcbBackground extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.seed = Date.now();
        this.resizeTimeout = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'color' && oldValue !== newValue && this.isConnected) {
            this.renderCircuit();
        }
    }

    connectedCallback() {
        this.renderCircuit();

        // Observer com debounce para redimensionamento de tela
        this.resizeObserver = new ResizeObserver(() => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.renderCircuit(), 150);
        });
        this.resizeObserver.observe(document.documentElement);
    }

    disconnectedCallback() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }

    createRandomGenerator(seed) {
        return function() {
            seed = (seed * 1664525 + 1013904223) % 4294967296;
            return seed / 4294967296;
        };
    }

    // Adicionado ao static get observedAttributes
    static get observedAttributes() {
        return ['color', 'devmode'];
    }

    // Propriedade para facilitar acesso via JavaScript (ex: pcb.devmode = true)
    get devmode() {
        return this.hasAttribute('devmode');
    }

    set devmode(val) {
        if (val) this.setAttribute('devmode', '');
        else this.removeAttribute('devmode');
    }

    renderCircuit() {
        const random = this.createRandomGenerator(this.seed);

        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;

        const strokeColor = this.getAttribute('color') || 'var(--brand-yellow, #fccc06)';
        const isDevMode = this.devmode;
        
        // Tamanho de cada célula da grade
        const gridSize = 40; 
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);

        // Estilos das animações e da grade para DevMode
        const devStyles = isDevMode ? `
            .dev-grid-line { stroke: #ff0055; stroke-opacity: 0.35; stroke-width: 1; }
            .dev-grid-text { fill: #ff0055; font-size: 9px; font-family: monospace; opacity: 0.6; }
        ` : '';

        // Estrutura visual da grade para DevMode
        let devGridSvg = '';
        if (isDevMode) {
            let lines = '';
            // Desenha linhas verticais e números das colunas
            for (let c = 0; c <= cols; c++) {
                const x = c * gridSize;
                lines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" class="dev-grid-line" />`;
                lines += `<text x="${x + 2}" y="10" class="dev-grid-text">C${c}</text>`;
            }
            // Desenha linhas horizontais e números das linhas
            for (let r = 0; r <= rows; r++) {
                const y = r * gridSize;
                lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" class="dev-grid-line" />`;
                lines += `<text x="2" y="${y - 2}" class="dev-grid-text">R${r}</text>`;
            }
            devGridSvg = `<g id="dev-grid">${lines}</g>`;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: -1;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    pointer-events: none;
                    display: block;
                    background-color: #0d1117;
                }
                svg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                @keyframes pulse-data {
                    to { stroke-dashoffset: -40; }
                }
                @keyframes led-blink {
                    0%, 100% { fill-opacity: 0.2; filter: drop-shadow(0 0 1px ${strokeColor}); }
                    50% { fill-opacity: 0.95; filter: drop-shadow(0 0 6px ${strokeColor}); }
                }
                .trilha-fluxo {
                    stroke-dasharray: 6, 14;
                    animation: pulse-data 3.5s linear infinite;
                }
                .led-via-pisca {
                    animation: led-blink 3s infinite ease-in-out;
                }
                ${devStyles}
            </style>
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
                        <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${strokeColor}" stroke-opacity="0.03" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                ${devGridSvg}

                <g fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.6">
                    ${this.generateCircuitLayout(cols, rows, gridSize, random, strokeColor)}
                </g>
            </svg>
        `;
    }

    generateCircuitLayout(cols, rows, gridSize, random, strokeColor) {
        let svgElements = '';
        
        // Matriz de ocupação da grade: grid[coluna][linha]
        // Armazena true se a célula/interseção estiver ocupada por um componente ou trilha
        const grid = Array(cols + 1).fill(null).map(() => Array(rows + 1).fill(false));

        // -------------------------------------------------------------
        // PASSO 1: Reservar espaço e desenhar Componentes Multi-Grade
        // -------------------------------------------------------------
        for (let c = 1; c < cols - 2; c += 2) {
            for (let r = 1; r < rows - 2; r += 2) {
                if (grid[c][r]) continue;

                // 8% de chance de spawnar um componente que ocupa bloco (ex: 2x2 a 4x3 celulas)
                if (random() < 0.08) {
                    const blockWidthSlots = Math.floor(random() * 3) + 2;  // 2 a 4 blocos de largura
                    const blockHeightSlots = Math.floor(random() * 2) + 2; // 2 a 3 blocos de altura

                    // Verifica se a área no grid está 100% livre
                    let livre = true;
                    for (let i = 0; i <= blockWidthSlots; i++) {
                        for (let j = 0; j <= blockHeightSlots; j++) {
                            if (c + i >= cols || r + j >= rows || grid[c + i][r + j]) {
                                livre = false;
                                break;
                            }
                        }
                        if (!livre) break;
                    }

                    if (livre) {
                        // Marcar área como ocupada
                        for (let i = 0; i <= blockWidthSlots; i++) {
                            for (let j = 0; j <= blockHeightSlots; j++) {
                                grid[c + i][r + j] = true;
                            }
                        }

                        // Coordenadas em pixels ajustadas ao Grid
                        const x = c * gridSize;
                        const y = r * gridSize;
                        const w = blockWidthSlots * gridSize;
                        const h = blockHeightSlots * gridSize;

                        // Exemplo visual do componente cobrindo múltiplas células
                        svgElements += `
                            <g class="componente-smd">
                                <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="4" fill="#161b22" stroke="${strokeColor}" stroke-dasharray="none" stroke-opacity="0.8" />
                                <circle cx="${x + 12}" cy="${y + 12}" r="2" fill="${strokeColor}" stroke="none" />
                            </g>
                        `;
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // PASSO 2: Passar Trilhas exatamente nas bordas do Grid
        // -------------------------------------------------------------
        for (let c = 0; c <= cols; c++) {
            for (let r = 0; r <= rows; r++) {
                if (!grid[c][r] && random() < 0.20) {
                    const startX = c * gridSize;
                    const startY = r * gridSize;
                    
                    // Sorteia direção inicial (Horizontal ou Vertical)
                    const dirX = random() > 0.5 ? (random() > 0.5 ? 1 : -1) : 0;
                    const dirY = dirX === 0 ? (random() > 0.5 ? 1 : -1) : 0;

                    svgElements += this.drawTrilhaAt(startX, startY, dirX, dirY, gridSize, random, grid, cols, rows, strokeColor);
                }
            }
        }

        return svgElements;
    }

    drawTrilhaAt(x, y, dirX, dirY, gridSize, random, grid, cols, rows, strokeColor) {
        // Define o número de quadros/células que a trilha vai andar ao longo da borda
        const totalSteps = Math.floor(random() * 4) + 2; 
        
        let pathD = `M ${x} ${y}`;
        let curC = Math.round(x / gridSize);
        let curR = Math.round(y / gridSize);
        let stepsWalked = 0;

        for (let i = 0; i < totalSteps; i++) {
            const nextC = curC + dirX;
            const nextR = curR + dirY;

            // Checa limites de tela e colisões no grid
            if (nextC >= 0 && nextC <= cols && nextR >= 0 && nextR <= rows && !grid[nextC][nextR]) {
                curC = nextC;
                curR = nextR;
                grid[curC][curR] = true; // Ocupa a interseção/borda
                
                const nextX = curC * gridSize;
                const nextY = curR * gridSize;
                
                pathD += ` L ${nextX} ${nextY}`;
                stepsWalked++;

                // 30% de chance de fazer uma curva ortogonal a 90° na borda da grade
                if (random() < 0.3) {
                    if (dirX !== 0) {
                        dirY = random() > 0.5 ? 1 : -1;
                        dirX = 0;
                    } else {
                        dirX = random() > 0.5 ? 1 : -1;
                        dirY = 0;
                    }
                }
            } else {
                break; // Para se atingir uma área já ocupada ou fim da tela
            }
        }

        // Se a trilha não conseguiu andar nenhum passo, ignora
        if (stepsWalked === 0) return '';

        let elements = `<path d="${pathD}" />`;

        // Adiciona via metálica (ponto de soldado) no final da linha
        const finalX = curC * gridSize;
        const finalY = curR * gridSize;
        elements += `<circle cx="${finalX}" cy="${finalY}" r="2" fill="${strokeColor}" stroke="none" />`;

        return elements;
    }
}

customElements.define('pcb-background', PcbBackground);