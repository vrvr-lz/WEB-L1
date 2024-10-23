// Инициализация графика
function initGraph(r) {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');

    // Очищаем график
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Коэффициенты масштабирования для осей X и Y
    const padding = 30; // Отступы от краев
    const scaleX = (canvas.width - 2 * padding) / (r * 2);  // Масштабирование по оси X
    const scaleY = (canvas.height - 2 * padding) / (r * 2);  // Масштабирование по оси Y

    // Центр координат с учетом отступов
    const centerX = (canvas.width - padding) / 2;
    const centerY = (canvas.height - padding) / 2;

    // 1. Полуокружность (в верхней правой четверти, по оси Y = R)
    ctx.fillStyle = 'rgba(166,28,60,0.85)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);  // Центр координат
    ctx.arc(centerX, centerY, r * scaleX, -Math.PI / 2, 0, false);  // Четверть окружности с радиусом R
    ctx.lineTo(centerX, centerY);  // Линия к центру
    ctx.closePath();
    ctx.fill();

    // 2. Прямоугольник (слева от центра, по оси X = -R, по оси Y = R/2)
    ctx.fillStyle = 'rgba(166,28,60,0.85)';
    ctx.fillRect(centerX - r * scaleX, centerY - (r / 2) * scaleY, r * scaleX, (r / 2) * scaleY);  // Прямоугольник

    // 3. Треугольник (в третьей четверти, по оси X = -R/2, по оси Y = -R/2)
    ctx.fillStyle = 'rgba(166,28,60,0.85)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);  // Центр
    ctx.lineTo(centerX - (r / 2) * scaleX, centerY);  // Левая точка по оси X
    ctx.lineTo(centerX, centerY + (r / 2) * scaleY);  // Нижняя точка по оси Y
    ctx.closePath();
    ctx.fill();

    // Рисуем оси с разметкой
    ctx.strokeStyle = '#212227';
    ctx.beginPath();
    // Горизонтальная ось
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    // Вертикальная ось
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Разметка осей X и Y
    ctx.fillStyle = '#212227';
    ctx.font = '12px Courier New';
    drawAxisMarks(ctx, centerX, centerY, r, scaleX, scaleY);
}

// Функция для разметки осей
function drawAxisMarks(ctx, centerX, centerY, r, scaleX, scaleY) {
    // Разметка оси X
    for (let i = -r; i <= r; i += r / 2) {
        const x = centerX + i * scaleX;
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
        if (i !== 0) {
            ctx.fillText(i.toFixed(1), x - 10, centerY + 20);  // Подписи делений по оси X
        }
    }

    // Разметка оси Y
    for (let i = -r; i <= r; i += r / 2) {
        const y = centerY - i * scaleY;
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
        if (i !== 0) {
            ctx.fillText(i.toFixed(1), centerX + 10, y + 5);  // Подписи делений по оси Y
        }
    }
}

// Обновление графика с новой точкой
function updateGraph(x, y, r) {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');

    // Инициализируем график с областью
    initGraph(r);

    // Коэффициенты преобразования координат
    const padding = 30; // Отступы от границ
    const scaleX = (canvas.width - 2 * padding) / (r * 2);
    const scaleY = (canvas.height - 2 * padding) / (r * 2);

    // Преобразуем координаты X и Y в координаты на графике
    const graphX = (canvas.width - padding) / 2 + x * scaleX;  // Преобразование координаты X
    const graphY = (canvas.height - padding) / 2 - y * scaleY; // Преобразование координаты Y

    // Рисуем точку
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(graphX, graphY, 5, 0, 2 * Math.PI);  // Радиус точки = 5
    ctx.fill();
}

// Инициализация графика при загрузке страницы
window.onload = function() {
    const defaultR = 5;  // Значение R по умолчанию для начального графика
    initGraph(defaultR);
};
