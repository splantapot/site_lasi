class NavigationBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="nav-bar">
                <div class="nav-bar__container">
                    <div class="nav-bar__branding">
                        <img class="nav-bar__logo" src="./assets/logo_lasi.png" alt="LASI Logo">
                        
                        <a href="/" class="nav-bar__title">
                            LA<span class="nav-bar__title-highlight">SI</span>
                        </a>
                    </div>

                    <nav class="nav-bar__links">
                        <a class="nav-bar__link" href="/" >Início</a>
                        <a class="nav-bar__link" href="/projetos">Projetos</a>
                        <a class="nav-bar__link" href="/">Membros</a>
                        <a class="nav-bar__link" href="/">TCCs</a>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('navigation-bar', NavigationBar);