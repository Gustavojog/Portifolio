const username = 'Gustavojog';

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const repos = await response.json();
        const container = document.getElementById('projects-container');

        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // ordena do mais recente para o mais antigo

        for (const repo of repos) {
            let imageUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`; // fallback se não tiver imagem no README

            try {
                const readmeResponse = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/master/README.md`);
                if (readmeResponse.ok) {
                    const readmeText = await readmeResponse.text();

                    // Regex para encontrar a primeira imagem no README (formato markdown ![alt](url))
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
            container.appendChild(proj);
        }
    } catch (error) {
        console.error('Erro ao buscar projetos do GitHub:', error);
    }
}

fetchGitHubProjects();






