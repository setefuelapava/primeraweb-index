/**
 * Voces de la Calle - Monitor de Imagen Pública
 * Maneja la visualización de datos de candidatos
 */
const StatsApp = {
    // Datos de ejemplo basados en opinión pública actual
    candidates: [
        { name: "Axel Kicillof", pos: 37, neg: 56 },
        { name: "Cristina Kirchner", pos: 31, neg: 64 },
        { name: "Javier Milei", pos: 49, neg: 45 },
        { name: "Patricia Bullrich", pos: 33, neg: 61 }
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
            <div class="candidate-column">
                <div class="bar-group">
                    <div class="bar bar-pos" style="height: ${c.pos}%">
                        <span class="perc-tag">${c.pos}%</span>
                    </div>
                    <div class="bar bar-neg" style="height: ${c.neg}%">
                        <span class="perc-tag" style="color:#ccff00">${c.neg}%</span>
                    </div>
                </div>
                <span class="name-tag">${c.name}</span>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => StatsApp.init());