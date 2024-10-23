document.addEventListener('DOMContentLoaded', () => {
    console.log("Документ загружен...");
    const form = document.getElementById('point-form'); // Получаем форму
    if (form) {
        console.log("Форма найдена");
        document.getElementById('submit-btn').addEventListener('click', (e) => {
            e.preventDefault(); // Блокируем стандартное поведение формы
            console.log("Кнопка нажата");
            validateAndSubmit();
        });
    } else {
        console.error("Форма не найдена");
    }
});

// Проверка на число
function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

// Валидация и отправка данных
function validateAndSubmit() {
    console.log("Валидация и отправка данных...");
    const x = document.getElementById("x-value").value;
    const r = document.getElementById("r-value").value;
    const y = document.querySelector('input[name="y-value"]:checked').value;

    console.log(`X: ${x}, R: ${r}, Y: ${y}`);

    // Валидация X
    if (!isNumeric(x) || x < -3 || x > 3) {
        alert("X должен быть числом в диапазоне от -3 до 3");
        return;
    }

    // Валидация R
    if (!isNumeric(r) || r < 2 || r > 5) {
        alert("R должен быть числом в диапазоне от 2 до 5");
        return;
    }

    // Обновляем график (если есть функция updateGraph)
    if (typeof updateGraph === 'function') {
        updateGraph(parseFloat(x), parseFloat(y), parseFloat(r)); // Обновляем график
    }

    // Отправляем данные на FastCGI сервер через функцию sendRequest
    sendRequest(parseFloat(x), parseFloat(y), parseFloat(r));
}

// Функция для отправки POST-запроса с использованием XMLHttpRequest
function sendRequest(x, y, r) {
    const xhr = new XMLHttpRequest();

    // Настраиваем запрос: POST-запрос по URL
    xhr.open('POST', 'http://localhost:8800/fcgi-bin/W1.jar', true);

    // Устанавливаем заголовок для передачи данных
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Обрабатываем ответ
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Парсим ответ и обновляем таблицу
                const response = JSON.parse(xhr.responseText);
                updateResultsTable(response);
            } else {
                console.error('Ошибка:', xhr.status, xhr.statusText);
                alert('Произошла ошибка при отправке запроса: ' + xhr.statusText);
            }
        }
    };

    // Отправляем запрос с данными в формате x=y&r=z
    xhr.send(`x=${x}&y=${y}&r=${r}`);
}

// Обновление таблицы результатов
function updateResultsTable(result) {
    const tableBody = document.querySelector('#results-table tbody');
    const row = document.createElement('tr'); // Создаем новую строку для таблицы

    // Заполняем строку результатами, включая executionTime
    row.innerHTML = `
        <td>${result.x}</td>
        <td>${result.y}</td>
        <td>${result.r}</td>
        <td>${result.hit ? 'Попадание' : 'Промах'}</td>
        <td>${result.time}</td>
        <td>${result.executionTime} ms</td> <!-- Вывод времени выполнения -->
    `;

    tableBody.appendChild(row); // Добавляем новую строку в таблицу
}
