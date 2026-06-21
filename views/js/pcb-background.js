class PcbBackground extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.seed = Date.now();
    }

    static get observedAttributes() {
        return ['color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'color' && oldValue !== newValue) {
            this.renderCircuit();
        }
    }

    connectedCallback() {
        this.renderCircuit();
        this.resizeObserver = new ResizeObserver(() => this.renderCircuit());
        this.resizeObserver.observe(document.documentElement);
    }

    disconnectedCallback() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    createRandomGenerator(seed) {
        return function() {
            seed = (seed * 1664525 + 1013904223) % 4294967296;
            return seed / 4294967296;
        };
    }

    renderCircuit() {
        const random = this.createRandomGenerator(this.seed);

        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;

        const strokeColor = this.getAttribute('color') || 'var(--brand-yellow, #fccc06)';
        const gridSize = 40; 
        const cols = Math.ceil(width / gridSize) + 1;
        const rows = Math.ceil(height / gridSize) + 1;

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
                    0%, 100% { fill-opacity: 0.1; filter: drop-shadow(0 0 1px ${strokeColor}); }
                    50% { fill-opacity: 0.9; filter: drop-shadow(0 0 5px ${strokeColor}); }
                }
                .trilha-fluxo {
                    stroke-dasharray: 6, 14;
                    animation: pulse-data 3.5s linear infinite;
                }
                .led-via-pisca {
                    animation: led-blink 3s infinite ease-in-out;
                }
            </style>
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
                        <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${strokeColor}" stroke-opacity="0.015" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <g fill="none" stroke="${strokeColor}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.45">
                    ${this.generateCircuitLayout(cols, rows, gridSize, random, strokeColor)}
                </g>
            </svg>
        `;
    }

    generateCircuitLayout(cols, rows, gridSize, random, strokeColor) {
        let svgElements = '';
        const grid = Array(cols).fill(null).map(() => Array(rows).fill(false));

        // PASSO 1: Posicionar Chips Dinâmicos e Componentes SMD
        for (let c = 2; c < cols - 4; c += 2) {
            for (let r = 2; r < rows - 4; r += 2) {
                if (grid[c][r]) continue;

                const randComp = random();

                // 1. CHIP MICROCONTROLADOR MULTI-FORMATO (SMD Variavel: 3x3, 4x4, 3x5, 4x6, etc.)
                if (randComp < 0.04) {
                    // Define tamanhos baseados em blocos do grid (mínimo 2x2, máximo 5x5 em escala)
                    const compCols = Math.floor(random() * 3) + 2; // Ex: 2 a 4 blocos horizontais
                    const compRows = Math.floor(random() * 3) + 2; // Ex: 2 a 4 blocos verticais

                    // Verifica se a área total do chip + margem de respiro está livre
                    let areaLivre = true;
                    for (let i = -1; i <= compCols; i++) {
                        for (let j = -1; j <= compRows; j++) {
                            if (!grid[c + i] || grid[c + i][r + j] === undefined || grid[c + i][r + j]) {
                                areaLivre = false;
                                break;
                            }
                        }
                    }

                    if (areaLivre) {
                        // Dimensões físicas reais do chip centralizado no grid interno
                        const padding = 12;
                        const rx = c * gridSize + padding;
                        const ry = r * gridSize + padding;
                        const rw = compCols * gridSize - (padding * 2);
                        const rh = compRows * gridSize - (padding * 2);

                        // Bloqueia permanentemente o espaço ocupado pelo CI na matriz de colisão
                        for (let i = -1; i <= compCols; i++) {
                            for (let j = -1; j <= compRows; j++) {
                                grid[c + i][r + j] = true;
                            }
                        }

                        // Desenha o encapsulamento do Chip Plástico
                        svgElements += `
                            <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="3" fill="#111625" stroke="${strokeColor}" stroke-opacity="0.6" stroke-width="1.5" />
                            <circle cx="${rx + 8}" cy="${ry + 8}" r="1.5" fill="${strokeColor}" fill-opacity="0.5" stroke="none" />
                        `;

                        // Gerar pinos metálicos nas laterais (Apenas nas arestas laterais, pulando cantos)
                        const pinoLength = 6;
                        
                        // Pinos Esquerdos e Direitos
                        for (let yOffset = gridSize; yOffset < compRows * gridSize; yOffset += 10) {
                            if (yOffset > padding && yOffset < (compRows * gridSize - padding)) {
                                const py = r * gridSize + yOffset;
                                
                                // Esquerda
                                svgElements += `<line x1="${rx - pinoLength}" y1="${py}" x2="${rx}" y2="${py}" stroke-opacity="0.6" />`;
                                if (random() > 0.5) { // Sorteia se o terminal gera uma trilha ativa para o background
                                    svgElements += this.drawTrilhaAt(rx - pinoLength, py, -1, 0, gridSize, random, grid, cols, rows);
                                }

                                // Direita
                                svgElements += `<line x1="${rx + rw}" y1="${py}" x2="${rx + rw + pinoLength}" y2="${py}" stroke-opacity="0.6" />`;
                                if (random() > 0.5) {
                                    svgElements += this.drawTrilhaAt(rx + rw + pinoLength, py, 1, 0, gridSize, random, grid, cols, rows);
                                }
                            }
                        }

                        // Pinos Superiores e Inferiores
                        for (let xOffset = gridSize; xOffset < compCols * gridSize; xOffset += 10) {
                            if (xOffset > padding && xOffset < (compCols * gridSize - padding)) {
                                const px = c * gridSize + xOffset;

                                // Superior
                                svgElements += `<line x1="${px}" y1="${ry - pinoLength}" x2="${px}" y2="${ry}" stroke-opacity="0.6" />`;
                                if (random() > 0.6) {
                                    svgElements += this.drawTrilhaAt(px, ry - pinoLength, 0, -1, gridSize, random, grid, cols, rows);
                                }

                                // Inferior
                                svgElements += `<line x1="${px}" y1="${ry + rh}" x2="${px}" y2="${ry + rh + pinoLength}" stroke-opacity="0.6" />`;
                                if (random() > 0.6) {
                                    svgElements += this.drawTrilhaAt(px, ry + rh + pinoLength, 0, 1, gridSize, random, grid, cols, rows);
                                }
                            }
                        }
                    }
                }
                // 2. TRANSISTOR SOT-23
                else if (randComp >= 0.04 && randComp < 0.08) {
                    const tx = c * gridSize;
                    const ty = r * gridSize;
                    grid[c][r] = grid[c+1][r] = grid[c-1][r] = true;

                    svgElements += `
                        <path d="M ${tx-6} ${ty-6} h 12 v 12 h -12 z" fill="#161b22" stroke-opacity="0.5" />
                        <path d="M ${tx-10} ${ty-3} h 4 M ${tx-10} ${ty+3} h 4 M ${tx+6} ${ty} h 4" stroke-opacity="0.6" />
                    `;
                    svgElements += this.drawTrilhaAt(tx + 10, ty, 1, 0, gridSize, random, grid, cols, rows);
                }
                // 3. DIODO LED SMD
                else if (randComp >= 0.08 && randComp < 0.13) {
                    const lx = c * gridSize;
                    const ly = r * gridSize;
                    grid[c][r] = grid[c+1][r] = grid[c-1][r] = true; 
                    const delay = (random() * 2.5).toFixed(1);

                    svgElements += `
                        <rect x="${lx-8}" y="${ly-5}" width="16" height="10" rx="1" fill="#1c212c" stroke-opacity="0.4" />
                        <path d="M ${lx-3} ${ly-3} L ${lx+2} ${ly} L ${lx-3} ${ly+3} Z" fill="none" stroke-opacity="0.4" />
                        <line x1="${lx+2}" y1="${ly-3}" x2="${lx+2}" y2="${ly+3}" stroke-opacity="0.4" />
                        <circle cx="${lx}" cy="${ly}" r="2.5" fill="${strokeColor}" class="led-via-pisca" style="animation-delay: ${delay}s" stroke="none" />
                    `;
                    svgElements += this.drawTrilhaAt(lx - 8, ly, -1, 0, gridSize, random, grid, cols, rows);
                    svgElements += this.drawTrilhaAt(lx + 8, ly, 1, 0, gridSize, random, grid, cols, rows);
                }
                // 4. RESISTOR / CAPACITOR SMD
                else if (randComp >= 0.13 && randComp < 0.22) {
                    const rx = c * gridSize;
                    const ry = r * gridSize;
                    grid[c][r] = grid[c+1][r] = grid[c-1][r] = true;

                    svgElements += `
                        <rect x="${rx-8}" y="${ry-4}" width="16" height="8" rx="1" fill="#0d1117" stroke-opacity="0.4" />
                        <rect x="${rx-8}" y="${ry-4}" width="3" height="8" fill="#8b949e" stroke="none" fill-opacity="0.4" />
                        <rect x="${rx+5}" y="${ry-4}" width="3" height="8" fill="#8b949e" stroke="none" fill-opacity="0.4" />
                    `;
                    svgElements += this.drawTrilhaAt(rx - 8, ry, -1, 0, gridSize, random, grid, cols, rows);
                    svgElements += this.drawTrilhaAt(rx + 8, ry, 1, 0, gridSize, random, grid, cols, rows);
                }
            }
        }

        // PASSO 2: Linhas de Cobre puras em áreas livres (Preenchimento denso)
        for (let c = 1; c < cols - 1; c++) {
            for (let r = 1; r < rows - 1; r++) {
                if (!grid[c][r] && random() < 0.28) {
                    const startX = c * gridSize;
                    const startY = r * gridSize;
                    const dirX = random() > 0.5 ? 1 : -1;
                    const dirY = random() > 0.5 ? 1 : -1;
                    
                    // Sorteia aleatoriamente barramentos preferencialmente horizontais ou verticais soltos
                    if (random() > 0.5) {
                        svgElements += this.drawTrilhaAt(startX, startY, dirX, 0, gridSize, random, grid, cols, rows);
                    } else {
                        svgElements += this.drawTrilhaAt(startX, startY, 0, dirY, gridSize, random, grid, cols, rows);
                    }
                    
                    if (random() < 0.15 && !grid[c][r]) {
                        svgElements += `<circle cx="${startX}" cy="${startY}" r="1.8" fill="none" stroke="${strokeColor}" stroke-width="1.2" stroke-opacity="0.5" />`;
                    }
                }
            }
        }

        return svgElements;
    }

    drawTrilhaAt(x, y, dirX, dirY, gridSize, random, grid, cols, rows) {
        const segments = Math.floor(random() * 3 + 1);
        const inclinar = random() > 0.5;
        
        let pathD = `M ${x} ${y}`;
        let curX = x;
        let curY = y;

        let cellC = Math.round(curX / gridSize);
        let cellR = Math.round(curY / gridSize);

        // Aplica inclinação inicial suave a 45° apenas se estiver navegando em eixos lineares puros
        if (inclinar && (dirX !== 0 || dirY !== 0)) {
            const nextC = cellC + (dirX !== 0 ? dirX : (random() > 0.5 ? 1 : -1));
            const nextR = cellR + (dirY !== 0 ? dirY : (random() > 0.5 ? 1 : -1));

            if (nextC >= 0 && nextC < cols && nextR >= 0 && nextR < rows && !grid[nextC][nextR]) {
                cellC = nextC;
                cellR = nextR;
                grid[cellC][cellR] = true; 
                
                curX = cellC * gridSize;
                curY = cellR * gridSize;
                pathD += ` L ${curX} ${curY}`;
            }
        }

        // Executa o caminho ortogonal contínuo
        for (let s = 0; s < segments; s++) {
            const nextC = cellC + dirX;
            const nextR = cellR + dirY;
            
            if (nextC >= 0 && nextC < cols && nextR >= 0 && nextR < rows && !grid[nextC][nextR]) {
                cellC = nextC;
                cellR = nextR;
                grid[cellC][cellR] = true; 
                curX = cellC * gridSize;
                curY = cellR * gridSize;
            } else {
                break; 
            }
        }

        if (dirX !== 0) pathD += ` H ${curX}`;
        else if (dirY !== 0) pathD += ` V ${curY}`;

        // Aborta trilhas nulas (estagnadas no ponto de colisão inicial)
        if (curX === x && curY === y) return '';

        let elements = `<path d="${pathD}" />`;

        // Efeito visual pulsante de dados injetado dinamicamente
        if (random() < 0.35) {
            elements += `<path d="${pathD}" class="trilha-fluxo" stroke-opacity="0.7" stroke-dasharray="4, 16" />`;
        }

        // Finaliza o barramento com microvias metálicas de acabamento
        if (random() > 0.45) {
            elements += `<circle cx="${curX}" cy="${curY}" r="1.2" fill="var(--brand-yellow, #fccc06)" fill-opacity="0.6" stroke="none" />`;
        }

        return elements;
    }
}

customElements.define('pcb-background', PcbBackground);