class NavigationBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header class="site-header">
                <div class="header-container">
                    <div class="header-branding">
                        <img src="/assets/logo_lasi.png" alt="LASI Logo" class="logo-img">
                        
                        <a href="/" class="header-title">
                            LA<span class="title-highlight">SI</span>
                        </a>
                    </div>

                    <nav class="navigation-links">
                        <a href="/" class="nav-link">Início</a>
                        <a href="/" class="nav-link">Cronograma</a>
                        <a href="/" class="nav-link">Membros</a>
                        <a href="/" class="nav-link">TCCs</a>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('navigation-bar', NavigationBar);