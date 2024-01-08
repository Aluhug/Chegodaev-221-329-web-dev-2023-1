/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable indent */
document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "6121ea40-7871-49f0-a7ce-4da920caa005";
    const routeList = document.getElementById("route-list");
    const paginationList = document.getElementById("pagination-list");
    const routesPerPage = 10;
    let currentPage = 1;
    let selectedRouteId = null;
    getRoutes(apiKey);
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const routeName = document.getElementById("routeName").value;
        const landmark = document.getElementById("landmarkSelect").value;
        searchRoutes(apiKey, routeName, landmark);
    });
    loadLandmarks();
    document.getElementById("searchForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const routeName = document.getElementById("routeName").value;
        const landmark = document.getElementById("landmarkSelect").value;

        searchRoutes(apiKey, routeName, landmark, currentPage);
    });

    function logJSON(jsonObject) {
        try {
            const jsonString = JSON.stringify(jsonObject, null, 2);
            console.log(jsonString);
        } catch (error) {
            console.error("Ошибка при преобразовании JSON:", error);
        }
    }

    function getRoutes(apiKey, page = 1) {
        const apiUrl = new URL(
            `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes`
        );
        apiUrl.searchParams.append("api_key", apiKey);
        apiUrl.searchParams.append("page", page);
        axios.get(apiUrl.toString())
            .then(response => {
                const data = response.data;
                renderRoutes(data);
                logJSON(data);
            })
            .catch(error => {
                console.error(`Ошибка при запросе данных: ${error}`);
            });
    }

    function renderGuides(guides) {
        const guidesContainer = document.getElementById('guides-container');
        guidesContainer.innerHTML = ''; 
    
        if (guides.length === 0) {
            const noGuidesMessage = document.createElement('p');
            noGuidesMessage.textContent = 'Для выбранного маршрута нет доступных гидов.';
            guidesContainer.appendChild(noGuidesMessage);
            return;
        }
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'table-hover');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Картинка профиля', 'ФИО', 'Языки', 'Опыт работы', 'Стоимость (руб/час)', 'Выбор'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        guides.forEach(guide => {
            const row = document.createElement('tr');
    
            const profileImageCell = document.createElement('td');
            profileImageCell.innerHTML = '<img src="images/11.webp" style="max-width: 50px; max-height: 50px;">';
            row.appendChild(profileImageCell);
    
            const nameCell = document.createElement('td');
            nameCell.textContent = guide.name;
            row.appendChild(nameCell);
    
            const languagesCell = document.createElement('td');
            languagesCell.textContent = guide.language;
            row.appendChild(languagesCell);
    
            const experienceCell = document.createElement('td');
            experienceCell.textContent = guide.workExperience + ' лет';
            row.appendChild(experienceCell);
    
            const priceCell = document.createElement('td');
            priceCell.textContent = guide.pricePerHour + ' руб/час';
            row.appendChild(priceCell);
    
            const selectCell = document.createElement('td');
            const selectButton = document.createElement('button');
            selectButton.className = 'btn btn-primary';
            selectButton.textContent = 'Выбрать';
            selectButton.addEventListener('click', () => {
                highlightGuideRow(guide.id);
            });
            selectCell.appendChild(selectButton);
            row.appendChild(selectCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        guidesContainer.appendChild(table);
    }
    function loadGuides(routeId) {
        if (routeId !== null) {
            const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=${apiKey}`;
            axios.get(apiUrl)
                .then(response => {
                    const guides = response.data;
                    renderGuides(guides);
                })
                .catch(error => {
                    console.error(`Ошибка при запросе данных о гидах: ${error}`);
                });
        } else {
            renderGuides([]);
        }
    }

    function renderRoutes(routes) {
        console.log("Rendered Routes:", routes); 
        routeList.innerHTML = "";
        const table = document.createElement("table");
        table.className = "table table-striped";
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
        const tableBody = document.createElement("tbody");
        const start = (currentPage - 1) * routesPerPage;
        const end = start + routesPerPage;
        const routesToShow = routes.slice(start, end);
        routesToShow.forEach((route) => {
            const row = document.createElement("tr");
            if (selectedRouteId === route.id) row.classList.add("table-success");
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
            const nameCell = createCell(route.name);
            const descriptionCell = createCell(route.description);
            const mainObjectCell = createCell(route.mainObject);
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
        table.appendChild(tableBody);
        routeList.appendChild(table);
        renderPagination(routes.length);
        tooltipInit();
    }

    function loadLandmarks() {
        const apiUrl = new URL(
            `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes`
        );
        apiUrl.searchParams.append("api_key", apiKey);
        axios.get(apiUrl.toString())
            .then(response => {
                const landmarks = response.data;
                renderLandmarks(landmarks);
            })
            .catch(error => {
                console.error(`Ошибка при запросе данных: ${error}`);
            });
    }
    function renderLandmarks(routes) {
        const landmarkSelect = document.getElementById("landmarkSelect");
            landmarkSelect.innerHTML = "<option selected>Выберите достопримечательность</option>";
            const uniqueLandmarks = new Set();
        routes.forEach((route) => {
            const landmarks = route.mainObject.split('–').map(landmark => landmark.trim());
            landmarks.forEach(landmark => uniqueLandmarks.add(landmark));
        });
            uniqueLandmarks.forEach((landmark) => {
            const option = document.createElement("option");
            option.value = landmark;
            option.textContent = landmark;
            landmarkSelect.appendChild(option);
        });
    }

    function searchRoutes(apiKey, routeName, landmark, page = 1) {
        const apiUrl = new URL(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes`);
        apiUrl.searchParams.append("api_key", apiKey);
        apiUrl.searchParams.append("page", page);
            if (routeName) {
            apiUrl.searchParams.append("name", routeName);
        }
        if (landmark && landmark !== "Выберите достопримечательность") {
            apiUrl.searchParams.append("landmark", landmark);
        }
        axios.get(apiUrl.toString())
            .then(response => {
                const data = response.data;
                if (landmark && landmark !== "Выберите достопримечательность") {
                    renderFilteredRoutesByLandmark(data, landmark);
                } else if (routeName) {
                    renderFilteredRoutesByName(data, routeName);
                } else {
                    renderRoutes(data);
                }
                logJSON(data);
            })
            .catch(error => {
                console.error(`Ошибка при запросе данных: ${error}`);
            });
    }

    function renderFilteredRoutesByName(routes, routeName) {
        const filteredRoutes = routes.filter(route => route.name.toLowerCase().includes(routeName.toLowerCase()));
        if (filteredRoutes.length === 0) {
            routeList.innerHTML = "<p>Нет маршрутов с указанным названием.</p>";
        } else {
            renderRoutes(filteredRoutes);
        }
    }

    function renderFilteredRoutesByLandmark(routes, selectedLandmark) {
        const filteredRoutes = routes.filter(route => route.mainObject == selectedLandmark);
        if (filteredRoutes.length === 0) {
            routeList.innerHTML = "<p>Нет маршрутов для выбранной достопримечательности.</p>";
        } else {
            renderRoutes(filteredRoutes);
        }
    }
    
    function renderPagination (totalRoutes) {
        const totalPages = Math.ceil(totalRoutes / routesPerPage);
        paginationList.innerHTML = "";
        const paginationNav = document.createElement("nav");
        paginationNav.setAttribute("aria-label", "Page navigation example");
        const pagination = document.createElement("ul");
        pagination.className = "pagination justify-content-center";
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
            if (currentPage > 1) {
                currentPage--;
                getRoutes(apiKey, currentPage);
            }
        });
        prevPageItem.appendChild(prevPageLink);
        pagination.appendChild(prevPageItem);

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
                currentPage = i;
                const routeName = document.getElementById("routeName").value;
            const landmark = document.getElementById("landmarkSelect").value;
            searchRoutes(apiKey, routeName, landmark, currentPage);
            });
            pageLink.appendChild(link);
            pagination.appendChild(pageLink);
        }
        const nextPageItem = document.createElement("li");
        const nextPageLink = document.createElement("a");
        nextPageItem.className = "page-item";
        nextPageLink.className = "page-link";
        nextPageLink.href = "#";
        nextPageLink.textContent = "Следующая";
        nextPageLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                getRoutes(apiKey, currentPage);
            }
        });
        nextPageItem.appendChild(nextPageLink);
        pagination.appendChild(nextPageItem);

        paginationNav.appendChild(pagination);
        paginationList.appendChild(paginationNav);
    }

    table.addEventListener('scroll', function() {
        if (table.scrollLeft + table.offsetWidth >= table.scrollWidth) {
            document.body.style.overflowX = 'hidden';
        } else {
            document.body.style.overflowX = 'visible';
        }
    });

    function tooltipInit() {
        const tooltips = document.querySelectorAll(".tt");
        tooltips.forEach((t) => {
            new bootstrap.Tooltip(t);
        });
    }
    loadLandmarks();
});
