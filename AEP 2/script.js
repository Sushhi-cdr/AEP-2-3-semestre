document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos HTML que serão manipulados
    const body = document.body;
    const skylight = document.getElementById('skylight');
    const windowLeft = document.getElementById('windowLeft');
    const windowRight = document.getElementById('windowRight');
    const solarPanel = document.getElementById('solarPanel');
    const currentTimeSpan = document.getElementById('currentTime');
    const buildingStateSpan = document.getElementById('buildingState');
    const energyLevelSpan = document.getElementById('energyLevel');
    const toggleButton = document.getElementById('toggleDayNight');

    // Variáveis para a simulação de tempo acelerado
    let simulatedTotalMinutes = 12 * 60; // Começa ao meio-dia (12:00)
    const SIMULATED_MINUTES_PER_REAL_SECOND = (24 * 60) / 30; // Simula 24 horas em 30 segundos reais
    const INTERVAL_MS = 1000; // O intervalo de atualização da simulação (1 segundo real)

    // Variável para simular o nível de energia solar (de 0 a 100%)
    let energy = 50; // Começa com um valor intermediário

    // Função principal que atualiza o estado do edifício
    function updateBuildingState() {
        // Incrementa o tempo simulado
        simulatedTotalMinutes = (simulatedTotalMinutes + SIMULATED_MINUTES_PER_REAL_SECOND) % (24 * 60);

        // Calcula a hora e minuto simulados
        const simulatedHour = Math.floor(simulatedTotalMinutes / 60);
        const simulatedMinute = Math.floor(simulatedTotalMinutes % 60);

        // Formata a hora para exibição (ex: 08:30)
        const formattedTime = `${simulatedHour.toString().padStart(2, '0')}:${simulatedMinute.toString().padStart(2, '0')}`;
        currentTimeSpan.textContent = formattedTime; // Atualiza a hora no painel

        // Define se é dia ou noite. Consideramos dia entre 6h da manhã e 18h (6h da tarde)
        const isDay = simulatedHour >= 6 && simulatedHour < 18;

        if (isDay) {
            // Se for dia:
            body.classList.remove('night');
            body.classList.add('day');

            // Remove as classes de 'fechado' e 'luzes acesas' para abrir as entradas de luz
            skylight.classList.remove('closed', 'lights-on');
            windowLeft.classList.remove('closed', 'lights-on');
            windowRight.classList.remove('closed', 'lights-on');

            // Adiciona a classe 'active' ao painel solar para indicar que está carregando
            solarPanel.classList.add('active');

            // Atualiza o texto do estado do edifício
            buildingStateSpan.textContent = 'Dia (Iluminação natural e carregamento solar)';
            buildingStateSpan.className = 'day-text';

            // Aumenta o nível de energia, limitado a 100%
            // Aumenta em 7% a cada segundo real para uma mudança visível ao longo do dia simulado
            if (energy < 100) {
                energy = Math.min(100, energy + 7);
            }
            energyLevelSpan.textContent = `${energy}%`;
            energyLevelSpan.className = 'charging';

        } else {
            // Se for noite:
            body.classList.remove('day');
            body.classList.add('night');

            // Remove a classe 'active' do painel solar, indicando que não está carregando
            solarPanel.classList.remove('active');

            // Diminui o nível de energia, limitado a 0%
            // Diminui em 7% a cada segundo real para uma mudança visível ao longo da noite simulada
            if (energy > 0) {
                energy = Math.max(0, energy - 7);
            }

            // Lógica para acender/apagar as luzes à noite
            if (energy > 0) {
                // Se houver energia, acende as luzes (amarelas)
                skylight.classList.remove('closed');
                skylight.classList.add('lights-on');
                windowLeft.classList.remove('closed');
                windowLeft.classList.add('lights-on');
                windowRight.classList.remove('closed');
                windowRight.classList.add('lights-on');

                buildingStateSpan.textContent = 'Noite (Uso de energia solar armazenada)';
                energyLevelSpan.className = 'discharging'; // Continua descarregando
            } else {
                // Se a energia acabar, apaga as luzes (volta ao estado 'closed' que é escuro)
                skylight.classList.remove('lights-on');
                skylight.classList.add('closed');
                windowLeft.classList.remove('lights-on');
                windowLeft.classList.add('closed');
                windowRight.classList.remove('lights-on');
                windowRight.classList.add('closed');

                buildingStateSpan.textContent = 'Noite (Energia esgotada, usando rede convencional)';
                energyLevelSpan.className = 'discharging'; // Continua indicando descarregado
            }

            buildingStateSpan.className = 'night-text';
            energyLevelSpan.textContent = `${energy}%`;
        }
    }

    // Event Listener para o botão de alternância
    toggleButton.addEventListener('click', () => {
        // Alterna entre uma hora diurna (12:00) e uma hora noturna (00:00)
        // Isso permite ao avaliador pular rapidamente para o dia ou noite
        if (simulatedTotalMinutes >= 6 * 60 && simulatedTotalMinutes < 18 * 60) {
            // Se está de dia, pula para a noite
            simulatedTotalMinutes = 0 * 60; // Meia-noite
        } else {
            // Se está de noite, pula para o dia
            simulatedTotalMinutes = 12 * 60; // Meio-dia
        }

        // Reseta a energia para um valor intermediário ao alternar, para demonstrar o ciclo
        energy = 50;
        updateBuildingState(); // Atualiza imediatamente o estado do edifício com a nova configuração
    });

    // Define um intervalo para que a função updateBuildingState seja chamada continuamente
    setInterval(updateBuildingState, INTERVAL_MS);

    // Chama a função uma vez imediatamente ao carregar a página para definir o estado inicial correto
    updateBuildingState();
});