class SliderBox extends HTMLElement {
    constructor() {
        super();
        this.timer = null;
        this.active = 0;
        this.qnt_slides = 1;
    }

    resetTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextActive(), 6000);
    }

    nextActive() {
        this.active = (this.active+1)%this.qnt_slides;
        this.setActive(this.active);
    }

    setActive(index) {
        this.active = index;
        const slides = Array.from(this.querySelectorAll('slider-item'));

        const dots_box = this.querySelector('.slider-dots');
        const dots = Array.from(dots_box.children);

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            if (dot.classList.contains('slider-active')) dot.classList.remove('slider-active');
            if (i == index) dot.classList.add('slider-active');

            const slide = slides[i];
            if (slide.classList.contains('slider-active')) slide.classList.remove('slider-active');
            if (i == index) slide.classList.add('slider-active');
        }

        this.resetTimer();
    }

    connectedCallback() {
        const children = Array.from(this.children); 
        this.qnt_slides = children.length? children.length: 1;

        this.innerHTML = `
            <div class="slider-container">
                <div class="slider-dots"></div>
            </div>
        `;

        const container = this.querySelector('.slider-container');
        const dots_box = this.querySelector('.slider-dots');
        children.forEach((item, i) => {
            container.appendChild(item);
            
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            dot.onclick = () => this.setActive(i);
            dots_box.appendChild(dot);
        });
        this.setActive(this.active);
    }
}

class SliderItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const text = this.getAttribute('text') || 'Some text...';
        const img = this.getAttribute('img') || undefined;
        const title = this.getAttribute('title') || 'Hello World!';
        
        this.style.backgroundImage = img? `url("${img}")` : 'none';

        this.innerHTML = `
            <div class="slider-item-container">
                <h3 class="slider-item-title"> ${title}</h3>
                <p class="slider-item-text">${text}</p>
            </div>
        `;
    }
}

customElements.define('slider-item', SliderItem);
customElements.define('slider-box', SliderBox);