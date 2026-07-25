class ProjectTree extends HTMLElement {
    connectedCallback() {
        const children = Array.from(this.children); // Obtém a lista dos projetos

        const title = this.getAttribute('title') || 'Título';
        const footer = this.getAttribute('footer') || 'Footer';

        this.innerHTML = `
            <div class="project-tree__container">
                <div class="project-tree__header">
                    <h2 class="project-tree__header-title">${title}</h2>
                </div>
                <div class="project-tree__body"></div>
                <div class="project-tree__footer">
                    <h2 class="project-tree__footer-title">${footer}</h2>
                </div>
            </div>
        `

        const treeBody = this.querySelector('.project-tree__body');
        const hasProjectChild = children.some((child, i) => child.tagName.toLowerCase() == 'project-branch');

        if (children.length <= 0 || !hasProjectChild) {
            const noProjectLabel = document.createElement('h4');
            noProjectLabel.className = 'project-tree__no-project-label';
            noProjectLabel.innerHTML = 'Não há projetos ainda...'
            treeBody.appendChild(noProjectLabel);
            return;
        }

        children.forEach((child, ix) => {
            const positionClass = ix%2==0? 'project-tree__left' : 'project-tree__right';
            child.classList.add(positionClass);
            treeBody.appendChild(child);
        });
    }
}

class ProjectBranch extends HTMLElement {
    constructor() {
        super();
        // this.title = this.date = this.text = this.thumbnail = '';
        this.media = new Map();
        this.presentation = undefined;
        this.presentation_images = [];

        this.MEDIA_ICONS = {
            facebook:
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"/></svg>`,
            github:
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216.5 362.5c-66-8-112.5-55.5-112.5-117 0-25 9-52 24-70-6.5-16.5-5.5-51.5 2-66 20-2.5 47 8 63 22.5 19-6 39-9 63.5-9s44.5 3 62.5 8.5c15.5-14 43-24.5 63-22 7 13.5 8 48.5 1.5 65.5 16 19 24.5 44.5 24.5 70.5 0 61.5-46.5 108-113.5 116.5 17 11 28.5 35 28.5 62.5l0 52C323 491.5 335.5 500 350.5 494 441 459.5 512 369 512 257 512 115.5 397 0 255.5 0S0 115.5 0 257c0 111 70.5 203 165.5 237.5 13.5 5 26.5-4 26.5-17.5l0-40c-7 3-16 5-24 5-33 0-52.5-18-66.5-51.5-5.5-13.5-11.5-21.5-23-23-6-.5-8-3-8-6 0-6 10-10.5 20-10.5 14.5 0 27 9 40 27.5 10 14.5 20.5 21 33 21s20.5-4.5 32-16c8.5-8.5 15-16 21-21z"/></svg>`,
            instagram: 
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>`,
            link: 
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z"/></svg>`,
            telegram:
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M256 8a248 248 0 1 0 0 496 248 248 0 1 0 0-496zM371 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5c-2.2 .5-37.1 23.5-104.6 69.1-9.9 6.8-18.9 10.1-26.9 9.9-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3 .6-4.5 6.7-9 18.4-13.7 72.3-31.5 120.5-52.3 144.6-62.3 68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9 2 1.7 3.2 4.1 3.5 6.7 .5 3.2 .6 6.5 .4 9.8z"/></svg>`,
            whatsapp:
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`
        }
    }

    capitalize(string = '') {
        return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
    } 

    hasMedia() {
        return Object.keys(this.MEDIA_ICONS).some((key) => this.media[key]);
    }

    renderShareIconsIn(element) {
        Object.keys(this.MEDIA_ICONS).forEach((key) => {
            const attrValue = this.getAttribute(key);
            this.media.set(key, attrValue);

            if (attrValue) {
                const link = document.createElement('a');
                link.href = attrValue;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'project-branch__link-icon';
                link.title = `Acessar ${this.capitalize(key)}`;

                link.innerHTML = this.MEDIA_ICONS[key];
                element.appendChild(link);
            }
        });
    }

    connectedCallback() {
        this.title = this.getAttribute('title') || 'Título do Projeto';
        this.date = this.getAttribute('date') || 'DD/MM/AAAA';
        this.text = this.getAttribute('text') || 'Algum Texto Qualquer...';

        this.thumbnail = this.getAttribute('thumbnail') || undefined; // './assets/blank-thumbnail.png';

        this.innerHTML = `
            <div class="project-branch__container">
                <!-- Thumbnail Inserted via JS -->
                <div class="project-branch__content">
                    <div class="project-branch__header">
                        <div class="project-branch__title-wrapper">
                            <h3 class="project-branch__title">${this.title}</h3>
                        </div>
                        <span class="project-branch__date">${this.date}</span>
                    </div>
                    <p class="project-branch__text">${this.text}</p>
                    <div class="project-branch__footer">
                        <h4  class="project-branch__details-text">Detalhes</h4>
                    </div>
                </div>
            </div>
        `;

        if (this.thumbnail) {
            const divThumbnail = document.createElement('div');
            divThumbnail.className = "project-branch__thumbnail-container"
            
            const imgThumbnail = document.createElement('img');
            imgThumbnail.src = this.thumbnail;
            imgThumbnail.alt = `Thumbnail for: ${this.title}`;
            imgThumbnail.className = "project-branch__thumbnail";
            
            divThumbnail.appendChild(imgThumbnail);
            this.querySelector('.project-branch__container').prepend(divThumbnail);
        } else {
            this.querySelector(".project-branch__text").classList.add("project-branch__long-text")
        }

        const titleWrapper = this.querySelector('.project-branch__title-wrapper');
        this.renderShareIconsIn(titleWrapper)

        // Add Button event
        this.querySelector('.project-branch__footer')
            .addEventListener('click', (e) => this.openDetailedView());

        // Get all presentation images [Numbered from 1 to 10]
        for (let i = 1; i <= 10; i++) {
            const present = this.getAttribute(`presentation${i}`) || undefined;
            if (present) {
                this.presentation_images.push(present);
            } else break;
        }

        if (this.presentation_images.length > 0) {
            const slideshow = document.createElement('slider-box');
            this.presentation_images.forEach((img) => {
                const sliderItem = document.createElement('slider-item');
                sliderItem.setAttribute('img', img);
                sliderItem.setAttribute('shadow-off', 'shadow-off');
                slideshow.appendChild(sliderItem);
            });
            this.presentation = slideshow;
        }
    }

    openDetailedView() {
        const overlay = document.createElement('div');
        overlay.className = 'project-branch__modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'project-branch__modal-container';

        modal.innerHTML = `
            <!-- SLIDESHOW INSERTED VIA JS -->
            <div class="project-branch__modal-content">
                <div class="project-branch__modal-header">
                    <div class="project-branch__modal-title-wrapper">
                        <h3 class="project-branch__title">${this.title}</h3>
                        <span class="project-branch__date">${this.date}</span>
                    </div>
                    <div class="project-branch__modal-icons-wrapper"></div>
                </div>
                <div class="project-branch__modal-text-box">
                    <p class="project-branch__modal-text">${this.text}</p>
                </div>
            </div>
        `;

        const iconsWrapper = modal.querySelector('.project-branch__modal-icons-wrapper');
        this.renderShareIconsIn(iconsWrapper);

        if (this.presentation) {
            const sliderBox = document.createElement('div');
            sliderBox.className = "project-branch__modal-slideshow";
            sliderBox.appendChild(this.presentation);
            modal.prepend(sliderBox);
            console.log(this.presentation)
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Fade in ---------------------------------------------
        requestAnimationFrame(() => {
            overlay.classList.add('project-branch__modal-visible');
        });

        // Fade out --------------------------------------------
        const closeModal = () => {
            document.removeEventListener('keydown', handleEscPress);
            overlay.classList.remove('project-branch__modal-visible');
            setTimeout(() => {
                overlay.remove();
            }, 300); 
        };

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal();
            }
        });

        const handleEscPress = (event) => {
            if (event.key === 'Escape') closeModal();
        };

        document.addEventListener('keydown', handleEscPress);
    }
}

customElements.define('project-tree', ProjectTree);
customElements.define('project-branch', ProjectBranch);