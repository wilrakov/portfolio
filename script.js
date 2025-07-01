document.addEventListener('DOMContentLoaded', () => {
    let SEO = document.querySelector('.seo');
    SEO.style.display = 'none';

    const typewriters = [
        { el: document.getElementById('intro-line-1'), text: 'Wilrakov', speed: 100, com: true },
        { el: document.getElementById('intro-line-2'), text: '   Développeur C, Python, Pascal & Web.', speed: 50, delay: 1500, com: false },
        { el: document.getElementById('intro-line-3'), text: '   Bienvenue sur mon portfolio.', speed: 50, delay: 3500, com: false },
        { el: document.getElementById('skills-line'), text: 'Compétences: [ "C", "Python", "Pascal", "HTML/CSS/JS", "Git" ]', speed: 50, delay: 5500, com: true },
        { el: document.getElementById('projects-title'), text: './fetch_projects.sh', speed: 75, delay: 7500, com: true },
        { el: document.getElementById('contact-line-1'), text: 'GitHub: ', speed: 50, delay: 9000, link: { text: 'github.com/wilrakov', url: 'https://github.com/wilrakov' }, com: true },
        { el: document.getElementById('contact-line-2'), text: 'Mail: ', speed: 50, delay: 10000, link: { text: 'wilrakov@proton.me', url: 'mailto:wilrakov@proton.me' }, com: true },
    ];

    const projectsContainer = document.getElementById('projects-container');

    function typeWriter(el, text, speed, com, callback) {
        let i = 0;
        el.innerHTML = '<span class="prompt"></span><span class="command"></span><span class="cursor"></span>';
        const promptEl = el.querySelector('.prompt');
        const commandEl = el.querySelector('.command');

        if (com) promptEl.textContent = '>$ ';

        function type() {
            if (i < text.length) {
                commandEl.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                const cursorEl = el.querySelector('.cursor');
                if (cursorEl) cursorEl.remove();
                if (callback) callback();
            }
        }
        type();
    }

    function typeWriterWithLinks(el, text, speed, link, callback) {
        // On tape le texte, puis on ajoute le lien
        typeWriter(el, text, speed, true, () => {
            const commandEl = el.querySelector('.command');
            const linkEl = document.createElement('a');
            linkEl.href = link.url;
            linkEl.target = '_blank';
            linkEl.textContent = link.text;
            linkEl.style.marginLeft = '5px';
            commandEl.appendChild(linkEl);
            if (callback) callback();
        });
    }


    function startAnimations() {
        typewriters.forEach(({ el, text, speed, delay, link, com }) => {
            setTimeout(() => {
                el.style.display = 'block';
                if (link) {
                    typeWriterWithLinks(el, text, speed, link);
                } else {
                    typeWriter(el, text, speed, com);
                }
            }, delay);
        });

        // Charger les projets après l'animation du titre des projets
        setTimeout(fetchProjects, 8500);
    }

    function fetchProjects() {
        fetch('projects.md')
            .then(response => response.text())
            .then(markdown => {
                // Utiliser une expression régulière pour parser les projets
                const projectRegex = /### (.*?)\n\n([^#]*)/g;
                let match;
                let projectIndex = 0; // Initialiser un compteur pour les projets
                while ((match = projectRegex.exec(markdown)) !== null) {
                    const title = match[1].trim();
                    const content = match[2].trim();

                    const projectEl = document.createElement('div');
                    projectEl.className = 'project';

                    const titleEl = document.createElement('h3');
                    titleEl.textContent = title;

                    const contentEl = document.createElement('div');
                    contentEl.innerHTML = marked.parse(content); // Utilise marked pour le contenu

                    projectEl.appendChild(titleEl);
                    projectEl.appendChild(contentEl);
                    projectsContainer.appendChild(projectEl);

                    // Animer l'apparition des projets avec un délai
                    setTimeout(() => {
                        projectEl.classList.add('show');
                    }, projectIndex * 150); // Utiliser projectIndex ici
                    projectIndex++; // Incrémenter le compteur
                }
            })
            .catch(error => {
                console.error('Erreur de chargement des projets:', error);
                projectsContainer.innerHTML = '<p style="color: var(--red);">Erreur: Impossible de charger `projects.md`.</p>';
            });
    }

    startAnimations();
});