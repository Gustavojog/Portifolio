
const username = 'Gustavojog'; // Substitua pelo seu usuário GitHub

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const repos = await response.json();
        const container = document.getElementById('projects-container');

        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // do mais recente para o mais antigo

        repos.forEach(repo => {
            const proj = document.createElement('div');
            proj.className = 'Proj';
            proj.innerHTML = `
          <i class="fa-brands fa-github"></i>
          <i class="imj"><img src="https://opengraph.githubassets.com/1/${username}/${repo.name}" alt="${repo.name}"></i>
          <h3>${repo.name}</h3>
          <p>${repo.description || 'Projeto sem descrição.'}</p>
          <a href="${repo.html_url}" target="_blank" style="display:block;margin-top:10px;color:#4db8ff;">Ver no GitHub</a>
        `;
            container.appendChild(proj);
        });
    } catch (error) {
        console.error('Erro ao buscar projetos do GitHub:', error);
    }
}

fetchGitHubProjects();




