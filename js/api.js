const token = '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';

async function fetchRepos() {
    console.log('Chargement des dépôts'); // Pour vérifier que la fonction est appelée

    try {
        // Récupérer les dépôts personnels
        const personalReposResponse = await fetch('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!personalReposResponse.ok) {
            throw new Error(`Erreur lors de la récupération des dépôts personnels: ${personalReposResponse.status} ${personalReposResponse.statusText}`);
        }

        const personalRepos = await personalReposResponse.json();
        console.log('Dépôts personnels:', personalRepos); // Afficher les dépôts personnels pour vérification

        // Récupérer les dépôts où vous êtes collaborateur
        const collaboratorReposResponse = await fetch('https://api.github.com/user/repos?affiliation=collaborator', {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!collaboratorReposResponse.ok) {
            throw new Error(`Erreur lors de la récupération des dépôts collaborateurs: ${collaboratorReposResponse.status} ${collaboratorReposResponse.statusText}`);
        }

        const collaboratorRepos = await collaboratorReposResponse.json();
        console.log('Dépôts collaborateurs:', collaboratorRepos); // Afficher les dépôts collaborateurs pour vérification

        // Fusionner les deux listes de dépôts
        const allRepos = [...personalRepos, ...collaboratorRepos];

        // Supprimer les doublons basés sur l'ID
        const uniqueRepos = Array.from(new Set(allRepos.map(repo => repo.id)))
            .map(id => allRepos.find(repo => repo.id === id));

        displayRepos(uniqueRepos);
    } catch (error) {
        console.error('Erreur lors de la récupération des repositories:', error);
    }
}

function displayRepos(repos) {
    const repoList = document.getElementById('repoList');
    repoList.innerHTML = '';

    repos.forEach(repo => {
        const li = document.createElement('li');
        li.className = 'repo-card';

        // Créer un lien pour le dépôt
        const link = document.createElement('a');
        link.href = repo.html_url;
        link.target = '_blank'; // Ouvrir le lien dans un nouvel onglet

        // Créer le titre du dépôt
        const title = document.createElement('div');
        title.className = 'repo-title';
        title.textContent = repo.name;

        // Créer la description du dépôt
        const description = document.createElement('div');
        description.className = 'repo-description';
        description.textContent = repo.description || 'Aucune description disponible';

        // Ajouter le titre et la description au lien
        link.appendChild(title);
        link.appendChild(description);

        // Ajouter le lien à la carte
        li.appendChild(link);

        // Ajouter la carte à la liste
        repoList.appendChild(li);
    });
}

// Appeler la fonction pour charger les dépôts dès que la page est chargée
window.onload = fetchRepos;
