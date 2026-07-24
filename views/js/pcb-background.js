// AI CODED!!!

class PcbBackground extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.seed = Date.now();
        this.resizeTimeout = null;
    }

    static get observedAttributes() {
        return ['color', 'devmode'];
    }

    get devmode() {
        return this.hasAttribute('devmode');
    }

    set devmode(val) {
        if (val) this.setAttribute('devmode', '');
        else this.removeAttribute('devmode');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.isConnected) {
            this.renderCircuit();
        }
    }

    connectedCallback() {
        this.renderCircuit();

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

    getResolvedColor() {
        const attrColor = this.getAttribute('color') || '#00f3ff';
        if (attrColor.startsWith('var(')) {
            const varName = attrColor.replace(/var\((--[^,\)]+).*\)/, '$1').trim();
            const resolved = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            return resolved || '#00f3ff';
        }
        return attrColor;
    }

    renderCircuit() {
        const random = this.createRandomGenerator(this.seed);

        const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        const strokeColor = this.getResolvedColor();
        const isDevMode = this.devmode;
        
        const gridSize = 20;
        const cols = Math.floor(width / gridSize);
        const rows = Math.floor(height / gridSize);

        const devStyles = isDevMode ? `
            .dev-grid-line { stroke: #ff0055; stroke-opacity: 0.35; stroke-width: 0.7; }
            .dev-grid-text { fill: #ff0055; font-size: 8px; font-family: monospace; opacity: 0.6; }
        ` : '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    z-index: -9999 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    pointer-events: none !important;
                    display: block !important;
                    background-color: var(--shadow-cyan);
                }
                svg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                
                @keyframes smd-blink {
                    0%, 100% { fill-opacity: 0.2; filter: none; }
                    50% { fill-opacity: 1; filter: drop-shadow(0 0 4px ${strokeColor}); }
                }

                .led-smd-chip {
                    animation: smd-blink infinite ease-in-out;
                }

                @keyframes pcb-flow {
                    from { stroke-dashoffset: 24; }
                    to { stroke-dashoffset: 0; }
                }

                .trilha-flow {
                    stroke-dasharray: 4, 8;
                    animation: pcb-flow linear infinite;
                }

                ${devStyles}
            </style>
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
                        <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${strokeColor}" stroke-opacity="0.04" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                ${isDevMode ? this.generateDevGrid(cols, rows, gridSize, width, height) : ''}

                <g fill="none" stroke="${strokeColor}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.6">
                    ${this.generateCircuitLayout(cols, rows, gridSize, random, strokeColor)}
                </g>
            </svg>
        `;
    }

    generateDevGrid(cols, rows, gridSize, width, height) {
        let lines = '';
        for (let c = 0; c <= cols; c++) {
            const x = c * gridSize;
            lines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" class="dev-grid-line" />`;
            if (c % 2 === 0) lines += `<text x="${x + 2}" y="9" class="dev-grid-text">C${c}</text>`;
        }
        for (let r = 0; r <= rows; r++) {
            const y = r * gridSize;
            lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" class="dev-grid-line" />`;
            if (r % 2 === 0) lines += `<text x="2" y="${y - 2}" class="dev-grid-text">R${r}</text>`;
        }
        return `<g id="dev-grid">${lines}</g>`;
    }

    generateCircuitLayout(cols, rows, gridSize, random, strokeColor) {
        let svgElements = '';
        const grid = Array(cols).fill(null).map(() => Array(rows).fill(false));
        const connectionPoints = [];
        const halfGrid = gridSize / 2;

        // -------------------------------------------------------------
        // 1. CIRCUITOS INTEGRADOS (CIs)
        // -------------------------------------------------------------
        for (let c = 2; c < cols - 4; c += 5) {
            for (let r = 2; r < rows - 4; r += 5) {
                if (grid[c][r]) continue;

                if (random() < 0.08) {
                    const icType = Math.floor(random() * 3);
                    let blockWidthSlots, blockHeightSlots;

                    if (icType === 0) {
                        blockWidthSlots = 2;
                        blockHeightSlots = Math.floor(random() * 3) + 3;
                    } else if (icType === 1) {
                        blockWidthSlots = 3;
                        blockHeightSlots = Math.floor(random() * 3) + 3;
                    } else {
                        const quadSize = Math.floor(random() * 2) + 3;
                        blockWidthSlots = quadSize;
                        blockHeightSlots = quadSize;
                    }

                    if (this.isAreaFree(grid, c, r, blockWidthSlots, blockHeightSlots, cols, rows)) {
                        this.occupyArea(grid, c, r, blockWidthSlots, blockHeightSlots);

                        const x = c * gridSize;
                        const y = r * gridSize;
                        const w = blockWidthSlots * gridSize;
                        const h = blockHeightSlots * gridSize;

                        const padMargin = 4;
                        const bodyX = x + padMargin;
                        const bodyY = y + padMargin;
                        const bodyW = w - (padMargin * 2);
                        const bodyH = h - (padMargin * 2);

                        let pinsSvg = '';

                        for (let rowIdx = 0; rowIdx < blockHeightSlots; rowIdx++) {
                            const pinY = y + (rowIdx * gridSize) + halfGrid;
                            pinsSvg += `<line x1="${x}" y1="${pinY}" x2="${bodyX}" y2="${pinY}" stroke="${strokeColor}" stroke-width="1.2" />`;
                            pinsSvg += `<line x1="${bodyX + bodyW}" y1="${pinY}" x2="${x + w}" y2="${pinY}" stroke="${strokeColor}" stroke-width="1.2" />`;

                            connectionPoints.push({ c: c, r: r + rowIdx });
                            connectionPoints.push({ c: c + blockWidthSlots - 1, r: r + rowIdx });
                        }

                        if (icType !== 0) {
                            for (let colIdx = 0; colIdx < blockWidthSlots; colIdx++) {
                                const pinX = x + (colIdx * gridSize) + halfGrid;
                                pinsSvg += `<line x1="${pinX}" y1="${y}" x2="${pinX}" y2="${bodyY}" stroke="${strokeColor}" stroke-width="1.2" />`;
                                pinsSvg += `<line x1="${pinX}" y1="${bodyY + bodyH}" x2="${pinX}" y2="${y + h}" stroke="${strokeColor}" stroke-width="1.2" />`;

                                connectionPoints.push({ c: c + colIdx, r: r });
                                connectionPoints.push({ c: c + colIdx, r: r + blockHeightSlots - 1 });
                            }
                        }

                        let notchSvg = `<circle cx="${bodyX + 5}" cy="${bodyY + 5}" r="1.5" fill="${strokeColor}" stroke="none" />`;
                        if (icType === 0) {
                            notchSvg += `<path d="M ${bodyX + (bodyW / 2) - 3} ${bodyY} A 3 3 0 0 0 ${bodyX + (bodyW / 2) + 3} ${bodyY}" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />`;
                        }

                        svgElements += `
                            <g class="componente-ci">
                                ${pinsSvg}
                                <rect x="${bodyX}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="2" fill="#161b22" stroke="${strokeColor}" stroke-width="1.2" />
                                ${notchSvg}
                            </g>
                        `;
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 2. HEADER PINS / BARRA DE PINOS (Novo Componente)
        // -------------------------------------------------------------
        for (let c = 1; c < cols - 5; c += 6) {
            for (let r = 1; r < rows - 2; r += 5) {
                if (grid[c][r]) continue;

                if (random() < 0.05) {
                    const pinCount = Math.floor(random() * 3) + 3; // 3 a 5 pinos
                    if (this.isAreaFree(grid, c, r, pinCount, 1, cols, rows)) {
                        this.occupyArea(grid, c, r, pinCount, 1);

                        let pinsHtml = '';
                        for (let p = 0; p < pinCount; p++) {
                            const px = (c + p) * gridSize + halfGrid;
                            const py = r * gridSize + halfGrid;
                            pinsHtml += `
                                <rect x="${px - 4}" y="${py - 4}" width="8" height="8" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />
                                <circle cx="${px}" cy="${py}" r="1.5" fill="${strokeColor}" stroke="none" />
                            `;
                            connectionPoints.push({ c: c + p, r: r });
                        }

                        svgElements += `<g class="componente-header-pins">${pinsHtml}</g>`;
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 3. DIP SWITCH (Novo Componente)
        // -------------------------------------------------------------
        for (let c = 2; c < cols - 4; c += 6) {
            for (let r = 2; r < rows - 3; r += 6) {
                if (grid[c][r]) continue;

                if (random() < 0.04) {
                    const switchSlots = 3;
                    if (this.isAreaFree(grid, c, r, switchSlots, 2, cols, rows)) {
                        this.occupyArea(grid, c, r, switchSlots, 2);

                        const startX = c * gridSize;
                        const startY = r * gridSize;
                        const w = switchSlots * gridSize;
                        const h = 2 * gridSize;

                        let switchesHtml = '';
                        for (let s = 0; s < switchSlots; s++) {
                            const swX = startX + (s * gridSize) + 5;
                            const isOn = random() > 0.5;
                            switchesHtml += `
                                <rect x="${swX}" y="${startY + 6}" width="10" height="28" rx="1" fill="#0b0f19" stroke="${strokeColor}" stroke-width="0.8" />
                                <rect x="${swX + 2}" y="${isOn ? startY + 8 : startY + 20}" width="6" height="10" rx="1" fill="${strokeColor}" stroke="none" />
                            `;
                            connectionPoints.push({ c: c + s, r: r });
                            connectionPoints.push({ c: c + s, r: r + 1 });
                        }

                        svgElements += `
                            <g class="componente-dip-switch">
                                <rect x="${startX + 2}" y="${startY + 2}" width="${w - 4}" height="${h - 4}" rx="2" fill="#161b22" stroke="${strokeColor}" stroke-width="1.2" />
                                ${switchesHtml}
                            </g>
                        `;
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 4. TRANSISTOR SMD SOT-23 (Novo Componente)
        // -------------------------------------------------------------
        for (let c = 1; c < cols - 3; c += 4) {
            for (let r = 1; r < rows - 3; r += 4) {
                if (grid[c][r]) continue;

                if (random() < 0.06) {
                    if (this.isAreaFree(grid, c, r, 2, 2, cols, rows)) {
                        this.occupyArea(grid, c, r, 2, 2);

                        const startX = c * gridSize + halfGrid;
                        const startY = r * gridSize + halfGrid;

                        svgElements += `
                            <g class="componente-transistor-sot23">
                                <!-- Traces de conexão -->
                                <line x1="${startX}" y1="${startY - 6}" x2="${startX}" y2="${startY + 6}" stroke="${strokeColor}" stroke-width="1.2" />
                                <line x1="${startX + 12}" y1="${startY}" x2="${startX + 20}" y2="${startY}" stroke="${strokeColor}" stroke-width="1.2" />
                                
                                <!-- Corpo do Transistor SOT-23 -->
                                <rect x="${startX - 3}" y="${startY - 8}" width="10" height="16" rx="1" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />
                                <!-- Aba Dissipadora Metalizada -->
                                <rect x="${startX + 7}" y="${startY - 5}" width="3" height="10" fill="${strokeColor}" fill-opacity="0.7" stroke="none" />
                            </g>
                        `;

                        connectionPoints.push({ c: c, r: r });
                        connectionPoints.push({ c: c + 1, r: r });
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 5. LED SMD (Com Blink Ativo)
        // -------------------------------------------------------------
        for (let c = 2; c < cols - 3; c += 4) {
            for (let r = 2; r < rows - 3; r += 4) {
                if (grid[c][r]) continue;

                if (random() < 0.08) {
                    const isHorizontal = random() > 0.5;
                    const wSlots = isHorizontal ? 2 : 1;
                    const hSlots = isHorizontal ? 1 : 2;

                    if (this.isAreaFree(grid, c, r, wSlots, hSlots, cols, rows)) {
                        this.occupyArea(grid, c, r, wSlots, hSlots);

                        const startX = c * gridSize + halfGrid;
                        const startY = r * gridSize + halfGrid;
                        const endX = (c + wSlots - 1) * gridSize + halfGrid;
                        const endY = (r + hSlots - 1) * gridSize + halfGrid;

                        const duration = (random() * 2 + 1).toFixed(2);
                        const delay = (random() * 2).toFixed(2);

                        if (isHorizontal) {
                            const midX = (startX + endX) / 2;
                            svgElements += `
                                <g class="componente-led-smd">
                                    <line x1="${startX}" y1="${startY}" x2="${midX - 7}" y2="${startY}" stroke="${strokeColor}" stroke-width="1.2" />
                                    <line x1="${midX + 7}" y1="${startY}" x2="${endX}" y2="${startY}" stroke="${strokeColor}" stroke-width="1.2" />
                                    
                                    <rect x="${midX - 7}" y="${startY - 4}" width="14" height="8" rx="1" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />
                                    <rect x="${midX - 7}" y="${startY - 4}" width="3" height="8" fill="${strokeColor}" fill-opacity="0.6" stroke="none" />
                                    <rect x="${midX + 4}" y="${startY - 4}" width="3" height="8" fill="${strokeColor}" fill-opacity="0.6" stroke="none" />
                                    <rect class="led-smd-chip" x="${midX - 2.5}" y="${startY - 2.5}" width="5" height="5" rx="1" fill="${strokeColor}" stroke="none" style="animation-duration: ${duration}s; animation-delay: ${delay}s;" />
                                </g>
                            `;
                        } else {
                            const midY = (startY + endY) / 2;
                            svgElements += `
                                <g class="componente-led-smd">
                                    <line x1="${startX}" y1="${startY}" x2="${startX}" y2="${midY - 7}" stroke="${strokeColor}" stroke-width="1.2" />
                                    <line x1="${startX}" y1="${midY + 7}" x2="${startX}" y2="${endY}" stroke="${strokeColor}" stroke-width="1.2" />
                                    
                                    <rect x="${startX - 4}" y="${midY - 7}" width="8" height="14" rx="1" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />
                                    <rect x="${startX - 4}" y="${midY - 7}" width="8" height="3" fill="${strokeColor}" fill-opacity="0.6" stroke="none" />
                                    <rect x="${startX - 4}" y="${midY + 4}" width="8" height="3" fill="${strokeColor}" fill-opacity="0.6" stroke="none" />
                                    <rect class="led-smd-chip" x="${startX - 2.5}" y="${midY - 2.5}" width="5" height="5" rx="1" fill="${strokeColor}" stroke="none" style="animation-duration: ${duration}s; animation-delay: ${delay}s;" />
                                </g>
                            `;
                        }

                        connectionPoints.push({ c: c, r: r });
                        connectionPoints.push({ c: c + (isHorizontal ? 1 : 0), r: r + (isHorizontal ? 0 : 1) });
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 6. CAPACITORES SMD
        // -------------------------------------------------------------
        for (let c = 1; c < cols - 3; c += 4) {
            for (let r = 1; r < rows - 3; r += 4) {
                if (grid[c][r]) continue;

                if (random() < 0.07) {
                    const isHorizontal = random() > 0.5;
                    const wSlots = isHorizontal ? 2 : 1;
                    const hSlots = isHorizontal ? 1 : 2;

                    if (this.isAreaFree(grid, c, r, wSlots, hSlots, cols, rows)) {
                        this.occupyArea(grid, c, r, wSlots, hSlots);

                        const startX = c * gridSize + halfGrid;
                        const startY = r * gridSize + halfGrid;
                        const endX = (c + wSlots - 1) * gridSize + halfGrid;
                        const endY = (r + hSlots - 1) * gridSize + halfGrid;

                        if (isHorizontal) {
                            const midX = (startX + endX) / 2;
                            svgElements += `
                                <g class="componente-capacitor-smd">
                                    <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${startY}" stroke="${strokeColor}" stroke-width="1.2" />
                                    <rect x="${midX - 6}" y="${startY - 4}" width="12" height="8" rx="1" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />
                                    <rect x="${midX - 6}" y="${startY - 4}" width="3.5" height="8" fill="${strokeColor}" fill-opacity="0.7" stroke="none" />
                                    <rect x="${midX + 2.5}" y="${startY - 4}" width="3.5" height="8" fill="${strokeColor}" fill-opacity="0.7" stroke="none" />
                                </g>
                            `;
                        } else {
                            const midY = (startY + endY) / 2;
                            svgElements += `
                                <g class="componente-capacitor-smd">
                                    <line x1="${startX}" y1="${startY}" x2="${startX}" y2="${endY}" stroke="${strokeColor}" stroke-width="1.2" />
                                    <rect x="${startX - 4}" y="${midY - 6}" width="8" height="12" rx="1" fill="#161b22" stroke="${strokeColor}" stroke-width="1" />
                                    <rect x="${startX - 4}" y="${midY - 6}" width="8" height="3.5" fill="${strokeColor}" fill-opacity="0.7" stroke="none" />
                                    <rect x="${startX - 4}" y="${midY + 2.5}" width="8" height="3.5" fill="${strokeColor}" fill-opacity="0.7" stroke="none" />
                                </g>
                            `;
                        }

                        connectionPoints.push({ c: c, r: r });
                        connectionPoints.push({ c: c + (isHorizontal ? 1 : 0), r: r + (isHorizontal ? 0 : 1) });
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 7. OSCILADOR DE CRISTAL (RTC/CLOCK)
        // -------------------------------------------------------------
        for (let c = 3; c < cols - 3; c += 6) {
            for (let r = 3; r < rows - 3; r += 6) {
                if (grid[c][r]) continue;

                if (random() < 0.04) {
                    if (this.isAreaFree(grid, c, r, 2, 1, cols, rows)) {
                        this.occupyArea(grid, c, r, 2, 1);

                        const startX = c * gridSize + halfGrid;
                        const startY = r * gridSize + halfGrid;
                        const endX = (c + 1) * gridSize + halfGrid;

                        const midX = (startX + endX) / 2;

                        svgElements += `
                            <g class="componente-cristal">
                                <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${startY}" stroke="${strokeColor}" stroke-width="1.2" />
                                <rect x="${midX - 10}" y="${startY - 6}" width="20" height="12" rx="5" fill="#161b22" stroke="${strokeColor}" stroke-width="1.2" />
                                <line x1="${midX - 6}" y1="${startY - 3}" x2="${midX - 6}" y2="${startY + 3}" stroke="${strokeColor}" stroke-width="1" />
                                <line x1="${midX + 6}" y1="${startY - 3}" x2="${midX + 6}" y2="${startY + 3}" stroke="${strokeColor}" stroke-width="1" />
                            </g>
                        `;

                        connectionPoints.push({ c: c, r: r });
                        connectionPoints.push({ c: c + 1, r: r });
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // 8. GERAÇÃO DE TRILHAS E FLUXO
        // -------------------------------------------------------------
        connectionPoints.forEach(pt => {
            const dirX = random() > 0.5 ? (random() > 0.5 ? 1 : -1) : 0;
            const dirY = dirX === 0 ? (random() > 0.5 ? 1 : -1) : 0;
            svgElements += this.drawTrilhaAt(pt.c, pt.r, dirX, dirY, gridSize, halfGrid, random, grid, cols, rows, strokeColor);
        });

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                if (!grid[c][r] && random() < 0.08) {
                    const dirX = random() > 0.5 ? (random() > 0.5 ? 1 : -1) : 0;
                    const dirY = dirX === 0 ? (random() > 0.5 ? 1 : -1) : 0;

                    svgElements += this.drawTrilhaAt(c, r, dirX, dirY, gridSize, halfGrid, random, grid, cols, rows, strokeColor);
                }
            }
        }

        return svgElements;
    }

    isAreaFree(grid, c, r, wSlots, hSlots, cols, rows) {
        for (let i = 0; i < wSlots; i++) {
            for (let j = 0; j < hSlots; j++) {
                if (c + i >= cols || r + j >= rows || grid[c + i][r + j]) {
                    return false;
                }
            }
        }
        return true;
    }

    occupyArea(grid, c, r, wSlots, hSlots) {
        for (let i = 0; i < wSlots; i++) {
            for (let j = 0; j < hSlots; j++) {
                grid[c + i][r + j] = true;
            }
        }
    }

    drawTrilhaAt(startC, startR, dirX, dirY, gridSize, halfGrid, random, grid, cols, rows, strokeColor) {
        const totalSteps = Math.floor(random() * 6) + 3; 
        
        let curC = startC;
        let curR = startR;
        
        const startX = curC * gridSize + halfGrid;
        const startY = curR * gridSize + halfGrid;
        
        let pathD = `M ${startX} ${startY}`;
        let stepsWalked = 0;

        for (let i = 0; i < totalSteps; i++) {
            const nextC = curC + dirX;
            const nextR = curR + dirY;

            if (nextC >= 0 && nextC < cols && nextR >= 0 && nextR < rows && !grid[nextC][nextR]) {
                curC = nextC;
                curR = nextR;
                grid[curC][curR] = true;
                
                const nextX = curC * gridSize + halfGrid;
                const nextY = curR * gridSize + halfGrid;
                
                pathD += ` L ${nextX} ${nextY}`;
                stepsWalked++;

                if (random() < 0.35) {
                    if (dirX !== 0) {
                        dirY = random() > 0.5 ? 1 : -1;
                        dirX = 0;
                    } else {
                        dirX = random() > 0.5 ? 1 : -1;
                        dirY = 0;
                    }
                }
            } else {
                break;
            }
        }

        if (stepsWalked === 0) return '';

        let elements = `<path d="${pathD}" opacity="0.6" />`;

        if (random() < 0.35) {
            const flowDuration = (random() * 1.5 + 1).toFixed(2);
            const isReverse = random() > 0.5;
            
            elements += `
                <path d="${pathD}" 
                      class="trilha-flow" 
                      stroke="${strokeColor}" 
                      stroke-width="1.4" 
                      stroke-opacity="0.9" 
                      style="animation-duration: ${flowDuration}s; ${isReverse ? 'animation-direction: reverse;' : ''}" />
            `;
        }

        const finalX = curC * gridSize + halfGrid;
        const finalY = curR * gridSize + halfGrid;

        if (random() < 0.3) {
            elements += `
                <circle cx="${finalX}" cy="${finalY}" r="3" fill="none" stroke="${strokeColor}" stroke-width="0.8" opacity="0.8" />
                <circle cx="${finalX}" cy="${finalY}" r="1" fill="${strokeColor}" stroke="none" />
            `;
        } else {
            elements += `<circle cx="${finalX}" cy="${finalY}" r="1.8" fill="${strokeColor}" stroke="none" />`;
        }

        return elements;
    }
}

customElements.define('pcb-background', PcbBackground);