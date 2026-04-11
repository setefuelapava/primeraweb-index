/**
 * Voces de la Calle - Monitor de Imagen Pública
 * Maneja la visualización de datos de candidatos
 */
const StatsApp = {
    // Datos de ejemplo basados en opinión pública actual
    candidates: [
        { name: "Axel Kicillof", pos: 38, neg: 54 },
        { name: "Cristina Kirchner", pos: 31, neg: 67 },
        { name: "Javier Milei", pos: 33, neg: 65 },
        { name: "Patricia Bullrich", pos: 42.7, neg: 50.3 }
    ],

    init: function() {
        console.log("Stats System: Sincronizando datos de opinión pública...");
        this.loadData();
        this.render();
        this.checkDailyUpdate();
    },

    loadData: function() {
        const savedData = localStorage.getItem('candidates_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                
                // Sincronización: Si el número de candidatos o los nombres cambiaron en el código,
                // reseteamos el almacenamiento para mostrar los nuevos datos hardcodeados.
                const storedNames = parsed.map(c => c.name).join(',');
                const currentNames = this.candidates.map(c => c.name).join(',');

                if (storedNames === currentNames) {
                    this.candidates = parsed;
                }
            } catch (e) {
                console.error("Error cargando datos, reiniciando...");
                localStorage.removeItem('candidates_data');
            }
        }
    },

    saveData: function() {
        localStorage.setItem('candidates_data', JSON.stringify(this.candidates));
    },

    checkDailyUpdate: function() {
        const lastUpdate = localStorage.getItem('last_stats_update');
        const now = Date.now();
        
        if (!lastUpdate) {
            localStorage.setItem('last_stats_update', now);
            this.saveData();
            return;
        }

        if (now - parseInt(lastUpdate) > 86400000) {
            localStorage.setItem('last_stats_update', now);
            this.applySmallVariation();
        }
    },

    applySmallVariation: function() {
        this.candidates.forEach(c => {
            const varPos = Math.floor(Math.random() * 5) - 2; // +/- 2%
            const varNeg = Math.floor(Math.random() * 5) - 2;
            c.pos = Math.max(5, Math.min(95, c.pos + varPos));
            c.neg = Math.max(5, Math.min(95, c.neg + varNeg));
        });
        this.saveData();
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
                        <span class="perc-tag" style="color:#ccff00; top: -15px;">${c.neg}%</span>
                    </div>
                </div>
                <span class="name-tag">${c.name.replace(/\s+/g, '<br>')}</span>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => StatsApp.init());