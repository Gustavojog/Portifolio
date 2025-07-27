const username = 'Gustavojog';

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const repos = await response.json();
        const container = document.getElementById('projects-container');

        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        for (const repo of repos) {
            let imageUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

            try {
                const readmeResponse = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/master/README.md`);
                if (readmeResponse.ok) {
                    const readmeText = await readmeResponse.text();
                    const imageMatch = readmeText.match(/!\[.*?\]\((.*?)\)/);
                    if (imageMatch && imageMatch[1]) {
                        imageUrl = imageMatch[1];
                    }
                }
            } catch (err) {
                console.warn(`Não foi possível buscar README de ${repo.name}`, err);
            }

            const proj = document.createElement('div');
            proj.className = 'Proj';
            proj.innerHTML = `
                <i class="fa-brands fa-github"></i>
                <i class="imj"><img src="${imageUrl}" alt="${repo.name}"></i>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Projeto sem descrição.'}</p>
                <a href="${repo.html_url}" target="_blank" style="display:block;margin-top:10px;color:#4db8ff;">Ver no GitHub</a>
            `;

            // Adiciona evento click para abrir página customizada
            proj.style.cursor = 'pointer';
            proj.addEventListener('click', () => {
                openProjectDetails(repo, imageUrl);
            });

            container.appendChild(proj);
        }
    } catch (error) {
        console.error('Erro ao buscar projetos do GitHub:', error);
    }
}

function openProjectDetails(repo, imageUrl) {
    const htmlContent = `
    <html>
    <head>
        <title>${repo.name} - Detalhes</title>
        <link rel="stylesheet" href="projects.css">
    </head>
    <body>
        <h1>${repo.name}</h1>
        <img src="${imageUrl}" alt="${repo.name}">
        <div class="section">
            <h2>Descrição</h2>
            <p>${repo.description || 'Sem descrição detalhada.'}</p>
        </div>
        <div class="section">
            <h2>Detalhes</h2>
            <ul>
                <li><strong>Última atualização:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</li>
                <li><strong>Linguagem principal:</strong> ${repo.language || 'Não especificada'}</li>
                <li><strong>Estrelas:</strong> ${repo.stargazers_count}</li>
                <li><strong>Forks:</strong> ${repo.forks_count}</li>
            </ul>
        </div>
        <a href="${repo.html_url}" target="_blank">Ver no GitHub</a>
    </body>
    </html>
    `;

    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

fetchGitHubProjects();








