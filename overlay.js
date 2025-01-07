const ps = new BroadcastChannel('panel_status');
const pl = new BroadcastChannel('player_list');
const cl = new BroadcastChannel('class_list');
const gi = new BroadcastChannel('game_info');
const gp = new BroadcastChannel('game_phase');

const killedPlayers = [];
const votedPlayers = [];

$(document).ready(function () {
    var element = document.getElementsByTagName("body")[0];
});
let killedOrder = [];
let votedOrder = [];
pl.onmessage = (event) => {
    const player_list = event.data.split('|');
    document.getElementById(player_list[0]).querySelectorAll('.nick')[0].innerHTML = player_list[1];
    document.getElementById(player_list[0]).querySelectorAll('.photo')[0].style.backgroundImage = 'url("content/photo/' + player_list[1] + '.png")';
};

cl.onmessage = (event) => {
    const class_list = event.data.split('|');
    const playerId = class_list[0];
    const playerClasses = class_list[1].split(' ');

    // Обновление классов игрока
    document.getElementById(playerId).setAttribute('class', class_list[1]);

    // Обновление порядка нажатий для killed и voted
    if (playerClasses.includes('killed')) {
        if (!killedOrder.includes(playerId)) {
            killedOrder.push(playerId);
        }
    } else {
        killedOrder = killedOrder.filter(id => id !== playerId);
    }

    if (playerClasses.includes('voted')) {
        if (!votedOrder.includes(playerId)) {
            votedOrder.push(playerId);
        }
    } else {
        votedOrder = votedOrder.filter(id => id !== playerId);
    }

    // Обновление отображения порядка нажатий
    updateStatusOrder();

    // Обработка Лучшего хода (ЛХ)
    if (class_list[2] === 'best-move') {
        const bestMove = class_list[3];
        const playerElement = document.getElementById(playerId);

        // Удаляем старый ЛХ, если он есть
        const oldBestMoveElement = playerElement.querySelector('.best-move');
        if (oldBestMoveElement) {
            oldBestMoveElement.remove();
        }

        // Создаем новый элемент ЛХ
        const bestMoveElement = document.createElement('div');
        bestMoveElement.className = 'best-move';
        bestMoveElement.textContent = `ЛХ: ${bestMove}`;

        playerElement.appendChild(bestMoveElement);
    }

    // Удаление Лучшего хода (ЛХ)
    if (class_list[2] === 'remove-best-move') {
        const playerElement = document.getElementById(playerId);
        const bestMoveElement = playerElement.querySelector('.best-move');
        if (bestMoveElement) {
            bestMoveElement.remove();
        }
    }
};

function updateStatusOrder() {
    // Отображаем порядок нажатий для killed
    const killedPlayersElement = document.getElementById('killed-players');
    killedPlayersElement.textContent = killedOrder.map(id => id.replace('player_', '')).join(', ');

    // Отображаем порядок нажатий для voted
    const votedPlayersElement = document.getElementById('voted-players');
    votedPlayersElement.textContent = votedOrder.map(id => id.replace('player_', '')).join(', ');
}

function updateStatusCounters() {
    const killedPlayers = document.querySelectorAll('.killed').length;
    const votedPlayers = document.querySelectorAll('.voted').length;

    document.getElementById('killed-players').textContent = killedPlayers;
    document.getElementById('voted-players').textContent = votedPlayers;
}




ps.onmessage = (event) => {
    const [command, elementId] = event.data.split('|');
    if (command === 'highlight') {
        const element = document.getElementById(elementId);
        if (element.classList.contains('highlight')) {
            element.classList.remove('highlight');
            element.classList.remove('speaker');
        } else {
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
            document.querySelectorAll('.speaker').forEach(el => el.classList.remove('speaker'));
            element.classList.add('highlight');
            element.classList.add('speaker');
        }
    } else {
        const panel_status = event.data.split('|');
        document.getElementsByTagName(panel_status[0])[0].setAttribute('class', panel_status[1]);
    }
};

gi.onmessage = (event) => {
    document.getElementById('game-info').innerText = event.data;
};

gp.onmessage = (event) => {
    const phasePanel = document.getElementById('game-phase-panel');
    phasePanel.innerText = event.data;
    phasePanel.classList.add('animate-phase');
    setTimeout(() => phasePanel.classList.remove('animate-phase'), 1000);
};
