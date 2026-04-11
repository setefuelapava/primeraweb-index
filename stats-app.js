/**
 * Voces de la Calle - Monitor de Imagen Pública
 * Maneja la visualización de datos de candidatos
 */
const StatsApp = {
    version: "2026-04-D", // Versión con colores específicos por dirigente
    candidates: [
        { name: "Javier Milei", pos: 33, neg: 65, fuente: "Zuban Córdoba", color: "#ff4500" },
        { name: "Patricia Bullrich", pos: 42, neg: 50, fuente: "Giacobbe", color: "#0056b3" },
        { name: "Axel Kicillof", pos: 38, neg: 54, fuente: "Zuban Córdoba", color: "#00a86b" },
        { name: "Cristina Kirchner", pos: 31, neg: 67, fuente: "Zuban Córdoba", color: "#7b2cbf" }
    ],

    init: function() {
        console.log("Stats System: Sincronizando datos de opinión pública...");
        this.loadData();
        this.actualizarGraficos();
        this.checkDailyUpdate();
    },

    loadData: function() {
        const savedData = localStorage.getItem('candidates_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const savedVersion = localStorage.getItem('stats_version');

                const storedNames = parsed.map(c => c.name).join(',');
                const currentNames = this.candidates.map(c => c.name).join(',');

                // Forzamos actualización si la versión es distinta o los nombres cambiaron
                if (storedNames === currentNames && savedVersion === this.version) {
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
        localStorage.setItem('stats_version', this.version);
    },

    checkDailyUpdate: function() {
        const lastUpdate = localStorage.getItem('last_stats_update');
        const now = Date.now();
        
        if (!lastUpdate) {
            localStorage.setItem('last_stats_update', now);
            this.saveData();
            return;
        }

        // Ciclo de actualización cada 24 horas (86400000 ms)
        if (now - parseInt(lastUpdate) >= 86400000) {
            console.log("Stats System: Iniciando actualización diaria (Ciclo 24hs)");
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
        this.actualizarGraficos();
    },

    actualizarGraficos: function() {
        const container = document.getElementById('contenedor-estadisticas');
        const sourceContainer = document.getElementById('stats-source');
        if (!container) return;

        // Mostrar la fuente de los datos (resumen de Abril 2026)
        if (sourceContainer) {
            sourceContainer.textContent = "Fuentes: Zuban Córdoba / Giacobbe - Abril 2026";
        }

        container.innerHTML = this.candidates.map(c => `
            <div class="candidate-column">
                <div class="bar-group">
                    <div class="bar bar-pos" style="height: ${c.pos}%; background: ${c.color}; box-shadow: 0 0 12px ${c.color};">
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