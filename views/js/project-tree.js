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
    connectedCallback() {
        this.title = this.getAttribute('title') || 'Título do Projeto';
        this.date = this.getAttribute('date') || 'DD/MM/AAAA';
        this.text = this.getAttribute('text') || 'Algum Texto Qualquer...';
        this.link = this.getAttribute('link') || undefined;

        this.thumbnail = this.getAttribute('thumbnail') || undefined; // './assets/blank-thumbnail.png';

        this.innerHTML = `
            <div class="project-branch__container">
                <!-- Thumbnail Inserted via JS -->
                <div class="project-branch__body">
                    <div class="project-branch__header">
                        <div class="project-branch__title-wrapper">
                            <h3 class="project-branch__title">${this.title}</h3>
                        </div>
                        <span class="project-branch__date">${this.date}</span>
                    </div>
                    <p class="project-branch__text">${this.text}</p>
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
            this.querySelector(".project-branch__text").className = "project-branch__long-text"
        }

        if (this.link) {
            const titleWrapper = this.querySelector('.project-branch__title-wrapper');
            
            const alink = document.createElement('a');
            alink.href = this.link;
            alink.target = '_blank';
            alink.rel = 'noopener noreferrer';
            alink.className = 'project-branch__link-icon';
            alink.title = 'Acessar link';

            alink.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            `;

            titleWrapper.appendChild(alink);
        }
    }
}

customElements.define('project-tree', ProjectTree);
customElements.define('project-branch', ProjectBranch);