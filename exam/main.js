/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
document.addEventListener("DOMContentLoaded", function () {
    // Объявляю большинство переменных
    const apiKey = "6121ea40-7871-49f0-a7ce-4da920caa005";
    const routeList = document.getElementById("route-list"); // Получаем элемент списка маршрутов
    const paginationList = document.getElementById("pagination-list"); // Получаем элемент списка пагинации
    const routesPerPage = 10; // Количество маршрутов на одной странице
    let currentPage = 1; // Текущая страница
    let selectedRouteId = null; // Выбранный маршрут изначально отсутствует
    let selectedGuideId = null; // Выбранный гид изначально отсутствует
    getRoutes(apiKey); // Получаем список маршрутов при загрузке страницы
    const searchForm = document.getElementById("searchForm"); // Получаем форму поиска маршрутов
    searchForm.addEventListener("submit", function (event) { // Добавляем обработчик события отправки формы поиска
        event.preventDefault();
        const routeName = document.getElementById("routeName").value;
        const landmark = document.getElementById("landmarkSelect").value;
        searchRoutes(apiKey, routeName, landmark);
    });
    loadLandmarks(); // Загружаем список достопримечательностей
    document.getElementById("searchForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const routeName = document.getElementById("routeName").value; // Получаем название маршрута из формы
        const landmark = document.getElementById("landmarkSelect").value; // Получаем выбранную достопримечательность из формы
        searchRoutes(apiKey, routeName, landmark, currentPage); // Выполняем поиск маршрутов с учетом текущей страницы
    });
    // Функция для вывода JSON-объекта в консоль
    function logJSON(jsonObject) {
        try {
            const jsonString = JSON.stringify(jsonObject, null, 2); //Проебразование объекта в JSON-строку с отступами (2 пробела)
            console.log(jsonString);// Вывод полученной JSON-строки в консоль
        } catch (error) {
            // Если произошла ошибка при преобразовании, выводим сообщение об ошибке в консоль
            console.error("Ошибка при преобразовании JSON:", error);
        }
    }
    // Функция для получения списка маршрутов с сервера
    function getRoutes(apiKey, page = 1) {
    // Создаем новый объект XMLHttpRequest
        const xhr = new XMLHttpRequest();
        // Создаем URL для запроса
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}&page=${page}`;
        // Открываем GET-запрос на указанный URL
        xhr.open('GET', apiUrl, true);
        // Устанавливаем обработчик события для обработки ответа от сервера
        xhr.onload = function() {
            if (xhr.status === 200) {
            // Если запрос успешен (статус 200), обрабатываем ответ
                const data = JSON.parse(xhr.responseText);
                // Вызываем функцию renderRoutes для отображения полученных маршрутов на странице
                renderRoutes(data);
                // Выводим полученные данные в виде JSON в консоль для отладки
                logJSON(data);
            } else {
            // Если произошла ошибка, выводим ее в консоль
                console.error(`Ошибка при запросе данных: ${xhr.statusText}`);
            }
        };
        // Устанавливаем обработчик события для обработки ошибок запроса
        xhr.onerror = function() {
            console.error('Произошла ошибка сети при выполнении запроса.');
        };
        // Отправляем GET-запрос
        xhr.send();
    }
    // Функция для загрузки гидов и прорисовки таблицы
    function renderGuides(guides) {
        const guidesContainer = document.getElementById('guides-container');
        guidesContainer.innerHTML = ''; //Очищаем содержимое элемента с ID "route-list" на странице
        // Если нет доступных гидов, выводим сообщение об отсутствии гидов и завершаем выполнение функции
        if (guides.length === 0) {
            const noGuidesMessage = document.createElement('p');
            noGuidesMessage.textContent = 'Для выбранного маршрута нет доступных гидов.';
            guidesContainer.appendChild(noGuidesMessage);
            return;
        }
        // Создаем HTML-таблицу для отображения списка маршрутов
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'table-hover');
        // Создаем заголовок таблицы
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Картинка профиля', 'ФИО', 'Языки', 'Опыт работы', 'Стоимость (руб/час)', 'Выбор'];
        // Создаем заголовки столбцов таблицы и добавляем их в строку заголовка
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        // Для каждого гида создаем строку таблицы и заполняем ее данными
        guides.forEach(guide => {
            const row = document.createElement('tr');
            // Вставляем изображение профиля гида 
            const profileImageCell = document.createElement('td');
            profileImageCell.innerHTML = '<img src="images/11.webp" style="max-width: 50px; max-height: 50px;">';
            row.appendChild(profileImageCell);
            //Вставляем имя гида 
            const nameCell = document.createElement('td');
            nameCell.textContent = guide.name;
            row.appendChild(nameCell);
            //Вставляем язык гида
            const languagesCell = document.createElement('td');
            languagesCell.textContent = guide.language;
            row.appendChild(languagesCell);
            //Вставялем опыт работы гида
            const experienceCell = document.createElement('td');
            experienceCell.textContent = guide.workExperience + ' лет';
            row.appendChild(experienceCell);
            //Вставляем цену гида
            const priceCell = document.createElement('td');
            priceCell.textContent = guide.pricePerHour + ' руб/час';
            row.appendChild(priceCell);
            //Вставляем кнопку нанять
            const selectCell = document.createElement('td');
            const selectButton = document.createElement('button');
            selectButton.className = 'btn btn-primary';
            selectButton.textContent = 'Нанять';
            // Если гид выбран, выделяем соответствующую строку таблицы
            if (guide.id === selectedGuideId) {
                row.classList.add('table-success'); 
            }
            // Добавляем обработчик события для кнопки нанять для выбора гида
            selectButton.addEventListener('click', () => {
                if (guide.id === selectedGuideId) {
                    selectedGuideId = null;
                    row.classList.remove('table-success');
                } else {
                    selectedGuideId = guide.id;
                    row.classList.add('table-success');
                }
            });
            selectCell.appendChild(selectButton);
            row.appendChild(selectCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        guidesContainer.appendChild(table);
    }
    //загрузка гидов по ID выбранного маршрута
    function loadGuides(routeId) {
        if (routeId !== null) {
            const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=${apiKey}`;
            // Используем fetch для выполнения GET-запроса
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        // Если статус ответа не "200 OK", обрабатываем ошибку
                        throw new Error(`Ошибка при запросе данных о гидах: ${response.status}`);
                    }
                    return response.json(); // Преобразуем ответ в JSON
                })
                .then(guides => {
                    renderGuides(guides);
                })
                .catch(error => {
                    console.error(`Ошибка при запросе данных о гидах: ${error}`); // Вывод ошибки в консоль в случае ошибки
                });
        } else {
            renderGuides([]);
        }
    }
    // Функция для отображения маршрутов и прорисовки таблицы
    function renderRoutes(routes) {
        console.log("Rendered Routes:", routes); 
        routeList.innerHTML = ""; // Очищаем содержимое элемента с ID "routeList" на странице
        // Создаем HTML-таблицу для отображения списка маршрутов и устанавливаем ей классы CSS
        const table = document.createElement("table");
        table.className = "table table-striped";
        // Создаем заголовок таблицы
        const tableHeader = document.createElement("thead");
        tableHeader.innerHTML = `
            <tr>
                <th>Название маршрута</th>
                <th>Описание</th>
                <th>Основные объекты</th>
                <th></th>
            </tr>
        `;
        table.appendChild(tableHeader);
        // Создаем тело таблицы
        const tableBody = document.createElement("tbody");
        // Определяем начало и конец отображаемого списка маршрутов на текущей странице
        const start = (currentPage - 1) * routesPerPage;
        const end = start + routesPerPage;
        // Выбираем подмножество маршрутов для отображения на текущей странице
        const routesToShow = routes.slice(start, end);
        // Для каждого маршрута создаем строку в таблице
        routesToShow.forEach((route) => {
            const row = document.createElement("tr");
            // Если маршрут выбран, выделяем его строку цветом
            if (selectedRouteId === route.id) row.classList.add("table-success");
            // Функция создает ячейку таблицы и обрезает текст, если он слишком длинный
            const createCell = (textContent) => {
                const cell = document.createElement("td");
                cell.classList.add("tt");
                const maxLength = 80; 
                if (textContent.length > maxLength) {
                    const truncatedText = textContent.substring(0, maxLength) + '...';
                    cell.textContent = truncatedText;         
                    cell.setAttribute('data-bs-toggle', 'tooltip');
                    cell.setAttribute('data-bs-placement', 'top');
                    cell.setAttribute('title', textContent);
                } else {
                    cell.textContent = textContent;
                }
                return cell;
            };
            // Создаем ячейки для названия маршрута, описания и основных объектов
            const nameCell = createCell(route.name);
            const descriptionCell = createCell(route.description);
            const mainObjectCell = createCell(route.mainObject);
            // Создаем ячейку для кнопки "Выбрать" и добавляем обработчик события
            const selectCell = document.createElement("td");
            const selectButton = document.createElement("button");
            selectButton.className = "btn btn-primary";
            selectButton.textContent = "Выбрать";
            selectButton.addEventListener("click", () => {
                if (selectedRouteId === route.id) {
                    selectedRouteId = null;
                    loadGuides(selectedRouteId);
                } else {
                    selectedRouteId = route.id;
                    loadGuides(selectedRouteId);
                }
                renderRoutes(routes);
            });
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(mainObjectCell);
            selectCell.appendChild(selectButton);
            row.appendChild(selectCell);
            tableBody.appendChild(row);
        });
        //Добавляем таблицу, тело таблицы и пагинацю на страницу
        table.appendChild(tableBody);
        routeList.appendChild(table);
        renderPagination(routes.length);
        // Инициализируем всплывающие подсказки (tooltips)
        tooltipInit();
    }
    // Функция для загрузки списка достопримечательностей
    function loadLandmarks() {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`;
        // Используем fetch для выполнения GET-запроса
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    // Если статус ответа не "200 OK", обрабатываем ошибку
                    throw new Error(`Ошибка при запросе данных: ${response.status}`);
                }
                return response.json(); // Преобразуем ответ в JSON
            })
            .then(landmarks => {
                renderLandmarks(landmarks); // Отображаем полученные достопримечательности на странице
            })
            .catch(error => {
                console.error(`Ошибка при запросе данных: ${error}`); // Вывод ошибки в консоль в случае ошибки
            });
    }
    // Фукнкция для отображения достопримечательностейц
    function renderLandmarks(routes) {
        // Получаем элемент "landmarkSelect" по его ID
        const landmarkSelect = document.getElementById("landmarkSelect");
        // Устанавливаем начальное значение по умолчанию в выпадающем списке
        landmarkSelect.innerHTML = "<option selected>Выберите достопримечательность</option>";
        // Создаем множество для уникальных достопримечательностей
        const uniqueLandmarks = new Set();
        // Проходим по каждому маршруту в списке
        routes.forEach((route) => {
            // Извлекаем достопримечательность из маршрута и убираем лишние пробелы
            const landmark = route.mainObject.trim();
            // Добавляем достопримечательность в множество уникальных достопримечательностей
            uniqueLandmarks.add(landmark);
        });
        // Для каждой уникальной достопримечательности создаем элемент в выпадающем списке
        uniqueLandmarks.forEach((landmark) => {
            const option = document.createElement("option");
            option.value = landmark;
            option.textContent = landmark;
            // Добавляем созданный элемент в выпадающий список
            landmarkSelect.appendChild(option);
        });
    }
    // Функция для поиска маршрута по назвванию и достопримечательностям
    function searchRoutes(apiKey, routeName, landmark, page = 1) {
        // Формируем URL для отправки запроса на сервер
        const apiUrl = new URL(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes`);
        // Добавляем параметр "api_key" к URL для аутентификации
        apiUrl.searchParams.append("api_key", apiKey);
        // Добавляем параметр "page" для указания номера страницы (по умолчанию 1)
        apiUrl.searchParams.append("page", page);
        // Если указано название маршрута, добавляем параметр "name" к URL
        if (routeName) {
            apiUrl.searchParams.append("name", routeName);
        }
        // Если выбрана достопримечательность, добавляем параметр "landmark" к URL
        if (landmark && landmark !== "Выберите достопримечательность") {
            apiUrl.searchParams.append("landmark", landmark);
        }
        // Отправляем GET-запрос на сервер с использованием fetch
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка при запросе данных: ${response.status}`);
                }
                // Преобразуем ответ в JSON
                return response.json();
            })
            .then(data => {
            // Обрабатываем полученные данные в виде JSON
                if (landmark && landmark !== "Выберите достопримечательность") {
                // Если выбрана достопримечательность, отображаем отфильтрованные маршруты
                    renderFilteredRoutesByLandmark(data, landmark);
                } else if (routeName) {
                // Если указано название маршрута, отображаем отфильтрованные маршруты
                    renderFilteredRoutesByName(data, routeName);
                } else {
                // Иначе отображаем все маршруты
                    renderRoutes(data);
                }
                // Выводим полученные данные в виде JSON в консоль для отладки
                logJSON(data);
            })
            .catch(error => {
            // Обрабатываем ошибку, если запрос не удался
                console.error(`Ошибка при запросе данных: ${error}`);
            });
    }
    // Функция фильтра маршрутов по названия
    function renderFilteredRoutesByName(routes, routeName) {
        // Фильтруем маршруты по названию, преобразуя все названия и искомое название в нижний регистр, чтобы не было проблем с регистрами при сравнениях 
        const filteredRoutes = routes.filter(route => route.name.toLowerCase().includes(routeName.toLowerCase()));
        if (filteredRoutes.length === 0) {
            // Если не найдено маршрутов с указанным названием, выводим сообщение
            routeList.innerHTML = "<p>Нет маршрутов с указанным названием.</p>";
        } else {
            // Если найдены маршруты, вызываем функцию renderRoutes для отображения отфильтрованных результатов по названию
            renderRoutes(filteredRoutes);
        }
    }
    // Функция фильтра маршрутов по достопримечательонсти
    function renderFilteredRoutesByLandmark(routes, selectedLandmark) {
    // Фильтруем маршруты по основному объекту, сравнивая его с выбранной достопримечательностью
        const filteredRoutes = routes.filter(route => route.mainObject === selectedLandmark);
        if (filteredRoutes.length === 0) {
        // Если не найдено маршрутов для выбранной достопримечательности, выводим сообщение
            routeList.innerHTML = "<p>Нет маршрутов для выбранной достопримечательности.</p>";
        } else {
        // Если найдены маршруты, вызываем функцию renderRoutes для отображения отфильтрованных результатов по достопримечательносмтии
            renderRoutes(filteredRoutes);
        }
    }
    // Функция для загрузки пагинации
    function renderPagination (totalRoutes) {
        // Вычисляем общее количество страниц 
        const totalPages = Math.ceil(totalRoutes / routesPerPage);
        // Очищаем существующий контент элемента paginationList
        paginationList.innerHTML = "";
        // Создаем элементы пагинации с помощью DOM-методов
        const paginationNav = document.createElement("nav");
        paginationNav.setAttribute("aria-label", "Page navigation example");
        const pagination = document.createElement("ul");
        pagination.className = "pagination justify-content-center";
        // Создаем элемент "Предыдущая страница"
        const prevPageItem = document.createElement("li");
        prevPageItem.className = "page-item";
        const prevPageLink = document.createElement("a");
        prevPageLink.className = "page-link";
        prevPageLink.href = "#";
        prevPageLink.tabIndex = -1;
        prevPageLink.setAttribute("aria-disabled", "true");
        prevPageLink.textContent = "Предыдущая";
        prevPageLink.addEventListener("click", (e) => {
            e.preventDefault();
            // Переключаемся на предыдущую страницу, если текущая страница не первая
            if (currentPage > 1) {
                currentPage--;
                // Вызываем функцию getRoutes() с обновленным номером страницы
                getRoutes(apiKey, currentPage);
            }
        });
        prevPageItem.appendChild(prevPageLink);
        pagination.appendChild(prevPageItem);
        // Создаем элементы для каждой страницы
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement("li");
            pageLink.className = "page-item";
            if (i === currentPage) {
                pageLink.classList.add("active");
            }
            const link = document.createElement("a");
            link.className = "page-link";
            link.href = "#";
            link.textContent = i;
            link.addEventListener("click", (e) => {
                e.preventDefault();
                // Переключаемся на выбранную страницу и выполняем поиск маршрутов
                currentPage = i;
                const routeName = document.getElementById("routeName").value;
                const landmark = document.getElementById("landmarkSelect").value;
                searchRoutes(apiKey, routeName, landmark, currentPage);
            });
            pageLink.appendChild(link);
            pagination.appendChild(pageLink);
        }
        // Создаем элемент "Следующая страница"
        const nextPageItem = document.createElement("li");
        const nextPageLink = document.createElement("a");
        nextPageItem.className = "page-item";
        nextPageLink.className = "page-link";
        nextPageLink.href = "#";
        nextPageLink.textContent = "Следующая";
        nextPageLink.addEventListener("click", (e) => {
            e.preventDefault();
            // Переключаемся на следующую страницу, если текущая страница не последняя
            if (currentPage < totalPages) {
                currentPage++;
                // Вызываем функцию getRoutes с обновленным номером страницы
                getRoutes(apiKey, currentPage);
            }
        });
        nextPageItem.appendChild(nextPageLink);
        pagination.appendChild(nextPageItem);
        // Добавляем элементы пагинации к родительскому элементу и отображаем их на странице
        paginationNav.appendChild(pagination);
        paginationList.appendChild(paginationNav);
    }
    // Функция инициализирует всплывающие подсказки для сжатых элементов
    function tooltipInit() {
        const tooltips = document.querySelectorAll(".tt");
        tooltips.forEach((t) => {
            new bootstrap.Tooltip(t);
        });
    }
    loadLandmarks();
});
