/**
 * Voces de la Calle - Monitor de Imagen Pública
 * Maneja la visualización de datos de candidatos
 */
const StatsApp = {
    // Datos de ejemplo basados en opinión pública actual
    candidates: [
        { name: "Candidato A", pos: 35, neg: 55 },
        { name: "Candidato B", pos: 42, neg: 38 },
        { name: "Candidato C", pos: 28, neg: 60 },
        { name: "Candidato D", pos: 48, neg: 42 }
    ],

    init: function() {
        console.log("Stats System: Sincronizando datos de opinión pública...");
        this.render();
        this.checkDailyUpdate();
    },

    checkDailyUpdate: function() {
        const lastUpdate = localStorage.getItem('last_stats_update');
        const now = new Date().getTime();
        
        // Si pasaron más de 24hs (86400000 ms), simulamos refresco de datos
        if (!lastUpdate || (now - lastUpdate > 86400000)) {
            localStorage.setItem('last_stats_update', now);
            this.applySmallVariation();
        }
    },

    applySmallVariation: function() {
        this.candidates.forEach(c => {
            const variation = Math.floor(Math.random() * 5) - 2; // +/- 2%
            c.pos = Math.max(0, Math.min(100, c.pos + variation));
        });
        this.render();
    },

    render: function() {
        const container = document.getElementById('candidates-display');
        if (!container) return;

        container.innerHTML = this.candidates.map(c => `
            <div class="candidate-row">
                <div class="candidate-name">
                    <span>${c.name}</span>
                    <span style="color: var(--primary-color)">${c.pos}%</span>
                </div>
                <div class="bar-container">
                    <div class="bar-pos" style="width: ${c.pos}%"></div>
                    <div class="bar-neg" style="width: ${c.neg}%"></div>
                </div>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => StatsApp.init());