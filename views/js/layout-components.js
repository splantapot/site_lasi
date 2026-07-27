class NavigationBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="nav-bar">
                <div class="nav-bar__container">
                    <div class="nav-bar__branding">
                        <img class="nav-bar__logo" src="./assets/info/logo-lasi.png" alt="LASI Logo">
                        
                        <a href="/" class="nav-bar__title">
                            LA<span class="nav-bar__title-highlight">SI</span>
                        </a>
                    </div>

                    <nav class="nav-bar__links">
                        <a class="nav-bar__link" href="/" >Início</a>
                        <a class="nav-bar__link" href="/projetos">Projetos</a>
                        <a class="nav-bar__link" href="/membros">Membros</a>
                        <a class="nav-bar__link" href="/">TCCs</a>
                    </nav>
                </div>
            </header>
        `;
    }
}

class FooterBar extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .footer-container {
                    background-color: var(--black, #000000);
                    color: var(--white, #ffffff);
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 20px;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, sans-serif;
                }
            </style>

            <footer class="footer-container">
                <p>&copy; ${new Date().getFullYear()} LASI - Todos os direitos reservados.</p>
            </footer>
        `;
    }
}

customElements.define('navigation-bar', NavigationBar);
customElements.define('footer-bar', FooterBar);