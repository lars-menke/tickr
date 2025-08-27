document.addEventListener('DOMContentLoaded', () => {
    // Ruft die Ergebnisse für eine bestimmte Liga ab und zeigt sie an
    async function fetchAndDisplayResults(leagueShortcut, containerId) {
        const url = `https://api.openligadb.de/getmatchdata/${leagueShortcut}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            const matches = await response.json();
            
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            if (matches.length === 0) {
                container.innerHTML = '<p>Aktuell keine Spiele gefunden.</p>';
                return;
            }

            matches.forEach(match => {
                const matchElement = document.createElement('div');
                matchElement.classList.add('match');

                const isFinished = match.matchIsFinished;
                
                const team1 = match.team1;
                const team2 = match.team2;
                
                let scoreText = 'noch nicht gespielt';
                
                if (isFinished && match.matchResults.length > 0) {
                    const score1 = match.matchResults[0].pointsTeam1;
                    const score2 = match.matchResults[0].pointsTeam2;
                    scoreText = `${score1} : ${score2}`;
                }
                
                // HTML-Markup mit Logos erstellen
                matchElement.innerHTML = `
                    <div class="match-info">
                        <img src="${team1.teamIconUrl}" alt="${team1.teamName}" class="team-logo">
                        <span class="team-name">${team1.teamName}</span>
                    </div>
                    <div class="score-info">
                        <span class="score">${scoreText}</span>
                    </div>
                    <div class="match-info">
                        <img src="${team2.teamIconUrl}" alt="${team2.teamName}" class="team-logo">
                        <span class="team-name">${team2.teamName}</span>
                    </div>
                `;

                container.appendChild(matchElement);
            });

        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
            const container = document.getElementById(containerId);
            container.innerHTML = `<p>Fehler beim Laden der Ergebnisse. Bitte versuchen Sie es später erneut.</p>`;
        }
    }
    
    // Umschalt-Funktionalität für die Ligen
    const bl1Section = document.getElementById('bl1');
    const bl2Section = document.getElementById('bl2');
    const toggleBl1Btn = document.getElementById('toggle-bl1');
    const toggleBl2Btn = document.getElementById('toggle-bl2');

    // Event-Listener für den 1. Bundesliga Schalter
    toggleBl1Btn.addEventListener('click', () => {
        bl1Section.classList.remove('hidden');
        bl2Section.classList.add('hidden');
        toggleBl1Btn.classList.add('active');
        toggleBl2Btn.classList.remove('active');
    });

    // Event-Listener für den 2. Bundesliga Schalter
    toggleBl2Btn.addEventListener('click', () => {
        bl2Section.classList.remove('hidden');
        bl1Section.classList.add('hidden');
        toggleBl2Btn.classList.add('active');
        toggleBl1Btn.classList.remove('active');
    });

    // Beim Laden der Seite die Daten für die 1. Bundesliga abrufen (Standardansicht)
    fetchAndDisplayResults('bl1', 'results-1bl');
    fetchAndDisplayResults('bl2', 'results-2bl');
});