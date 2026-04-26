class NavigationBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="logo">
                    <img src="./assets/imgs/logo_lasi.png" alt="Logo do LASI" width="50">
                </div>
                <!-- <div>BTN</div> -->
                <nav>
                    <a href="./index.html"><h3>Início</h3></a>
                    <a href="./pages/cronograma.html"><h3>Cronograma</h3></a>
                    <a href="./pages/membros.html"><h3>Membros</h3></a>
                    <a href="./pages/tccs.html"><h3>TCCs</h3></a>
                </nav>
            </header>
        `;
    }
}

customElements.define('navigation-bar', NavigationBar);