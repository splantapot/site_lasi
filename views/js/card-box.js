class CardBox extends HTMLElement {
    connectedCallback() {
        const children = Array.from(this.children);

        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const grid = this.hasAttribute('grid') || undefined;
        const row = this.hasAttribute('row') || undefined;
        const column = this.hasAttribute('column') || undefined;

        this.innerHTML = `
            <div class="card-box__container">
                <div class="card-box__header">
                    <h2 class="card-box__title">${title}</h2>
                    <h3 class="card-box__subtitle">${subtitle}</h3>
                </div>
                <div class="card-box__body"></div>
            </div>
        `;

        const cardBoxBody = this.querySelector('.card-box__body');
        if (row) cardBoxBody.classList.add('card-box__row');
        else if (column) cardBoxBody.classList.add('card-box__column');
        else cardBoxBody.classList.add('card-box__grid');

        children.forEach((child) => {
            cardBoxBody.appendChild(child);
        });
    }
}

class CardItem extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute('icon') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';

        const media = this.getAttribute('media') || undefined;
        const media_url = this.getAttribute('media-url') || undefined;

        // Verifica se o ícone é uma imagem (caminho relativo, absoluto ou URL)
        const isImage = icon.includes('.') || icon.includes('/') || icon.includes('http');
        
        let iconContent = '';
        if (icon) {
            if (isImage) {
                iconContent = `<img src="${icon}" alt="${title}" class="card-item__img-icon" />`;
            } else {
                iconContent = `<i class="${icon} card-item__i-icon"></i>`;
            }
        }

        // Media or normal card
        if (media && media_url && MEDIA_ICONS[media] /* Exists icon for this media */) {
            this.innerHTML = `
                <div class="card-item__container--media}">
                    <a href="${media_url}" target="_blank" rel="noopener noreferrer" title="${capitalize(media)}">
                        <div class="card-item__icon--media">${MEDIA_ICONS[media]}</div>
                    </a>
                </div>
            `;
        } else {
            this.innerHTML = `
                <div class="card-item__container ${icon ? '' : 'card-item__container--no-icon'}">
                    ${icon ? `<div class="card-item__icon">${iconContent}</div>` : ''}
                    <div class="card-item__content">
                        ${title ? `<h4 class="card-item__title">${title}</h4>` : ''}
                        ${text ? `<p class="card-item__text">${text}</p>` : ''}
                    </div>
                </div>
            `;
        }

    }
}

customElements.define('card-box', CardBox);
customElements.define('card-item', CardItem);