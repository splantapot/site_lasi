class SliderBox extends HTMLElement {

    ACTIVE_CLASS = 'slider__active'

    constructor() {
        super();
        this.timer = null;
        this.active = 0;
        this.qnt_slides = 1;
        this.interval = 6000;
    }

    resetTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextActive(), this.interval);
    }

    nextActive() {
        this.active = (this.active+1)%this.qnt_slides;
        this.setActive(this.active);
    }

    setActive(index) {
        this.active = index;
        const slides = Array.from(this.querySelectorAll('slider-item'));

        const dots_box = this.querySelector('.slider__dots-container');
        const dots = Array.from(dots_box.children);

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            if (dot.classList.contains(this.ACTIVE_CLASS)) dot.classList.remove(this.ACTIVE_CLASS);
            if (i == index) dot.classList.add(this.ACTIVE_CLASS);

            const slide = slides[i];
            if (slide.classList.contains(this.ACTIVE_CLASS)) slide.classList.remove(this.ACTIVE_CLASS);
            if (i == index) slide.classList.add(this.ACTIVE_CLASS);
        }

        this.resetTimer();
    }

    connectedCallback() {
        const children = Array.from(this.children); // Obtém a lista dos slide-itens
        this.qnt_slides = children.length? children.length: 1;

        this.interval = this.getAttribute('interval') || 6000; /* Auto scroll time ms */
        if (!this.interval || this.interval == NaN) this.interval = 6000;
        

        this.innerHTML = `
            <div class="slider__container">
                <div class="slider__dots-container"></div>
            </div>
        `;

        const container = this.querySelector('.slider__container');
        const dots_box = this.querySelector('.slider__dots-container');
        // Reorganiza os slide-itens adicionando seus respectivos "dots"
        children.forEach((item, i) => {
            container.appendChild(item);
            
            const dot = document.createElement('div');
            dot.className = 'slider__dot';
            dot.onclick = () => this.setActive(i);
            dots_box.appendChild(dot);
        });
        this.setActive(this.active);
    }
}

class SliderItem extends HTMLElement {
    connectedCallback() {
        const text = this.getAttribute('text') || '';
        const img = this.getAttribute('img') || undefined;
        const title = this.getAttribute('title') || '';

        // Opções para adicionar um link_text
        const link_text = this.getAttribute('link-text') || undefined;
        const link_url = this.getAttribute('link-url') || undefined;

        if (!this.hasAttribute('shadow-off')) {
            this.classList.add("slider__shadow");
        }
        
        this.style.backgroundImage = img? `url("${img}")` : 'none';

        this.innerHTML = `
            <div class="slider-item__container">
                <h3 class="slider-item__title"> ${title}</h3>
                <p class="slider-item__text">${text}</p>
            </div>
        `;

        if (link_text && link_url) {
            const container = this.querySelector(".slider-item__container");
            const new_a = document.createElement('a');
            new_a.className = "slider-item__link-text"
            new_a.innerHTML = link_text;
            new_a.href = link_url;
            container.appendChild(new_a);
        }
    }
}

customElements.define('slider-item', SliderItem);
customElements.define('slider-box', SliderBox);