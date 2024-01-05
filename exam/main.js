/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
const apiKey = "6121ea40-7871-49f0-a7ce-4da920caa005";
const routeList = document.getElementById("route-list");
const paginationList = document.getElementById("pagination-list");
const routesPerPage = 10;
let currentPage = 1;
let selectedRoute = null;

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

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.responseType = "json";

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            renderRoutes(data);
            logJSON(data);
        } else {
            console.error(`Ошибка при запросе данных: ${xhr.status}`);
        }
    };

    xhr.onerror = function () {
        console.error("Произошла ошибка при выполнении запроса.");
    };

    xhr.send();
}

function renderRoutes(routes) {
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
        if (selectedRoute === route.id) {
            row.classList.add("table-success");
        }

        const createCell = (textContent) => {
            const cell = document.createElement("td");
            cell.classList.add("tt");
            cell.textContent = textContent;
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
            selectedRoute = route.id;
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

function renderPagination(totalRoutes) {
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
            getRoutes(apiKey, currentPage);
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

function tooltipInit() {
    const tooltips = document.querySelectorAll(".tt");
    tooltips.forEach((t) => {
        new bootstrap.Tooltip(t);
    });
}

window.onload = function () {
    getRoutes(apiKey);
};

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Добавьте следующий код после существующего JavaScript-кода

document.getElementById("routeSelection").addEventListener("change", function () {
    const selectedRouteId = this.value;
    getGuides(apiKey, selectedRouteId);
});

document.getElementById("languageFilter").addEventListener("change", function () {
    onFilterChange();
});

document.getElementById("experienceFrom").addEventListener("change", function () {
    onFilterChange();
});

document.getElementById("experienceTo").addEventListener("change", function () {
    onFilterChange();
});


const guideTable = document.getElementById("guide-table");
const guidePagination = document.getElementById("guide-pagination");
const languageFilter = document.getElementById("languageFilter");
const experienceFromFilter = document.getElementById("experienceFrom");
const experienceToFilter = document.getElementById("experienceTo");
let selectedGuide = null;

function onRouteSelectionChange() {
    const selectedRouteId = document.getElementById("routeSelection").value;
    getGuides(apiKey, selectedRouteId);
}

function onFilterChange() {
    getGuides(apiKey, document.getElementById("routeSelection").value);
}

function getGuides(apiKey, routeId, page = 1) {
    const apiUrl = new URL(
        `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides`
    );
    apiUrl.searchParams.append("api_key", apiKey);
    apiUrl.searchParams.append("route_id", routeId);
    apiUrl.searchParams.append("page", page);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.responseType = "json";

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = xhr.response;
            renderGuides(data);
            logJSON(data);
        } else {
            console.error(`Ошибка при запросе данных: ${xhr.status}`);
        }
    };

    xhr.onerror = function () {
        console.error("Произошла ошибка при выполнении запроса.");
    };

    xhr.send();
}

function renderGuides(guides) {
    tableBody.innerHTML = "";
    const table = document.createElement("table");
    table.className = "table table-striped";
    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
        <tr>
            <th>ФИО</th>
            <th>Опыт работы</th>
            <th>Языки</th>
            <th>Стоимость (руб./час)</th>
            <th></th>
        </tr>
    `;

    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    guides.forEach((guide) => {
        const row = document.createElement("tr");
        if (selectedGuide === guide.id) {
            row.classList.add("table-success");
        }

        const createCell = (textContent) => {
            const cell = document.createElement("td");
            cell.classList.add("tt");
            cell.textContent = textContent;
            return cell;
        };

        // Добавляем ячейки с данными гида
        const nameCell = createCell(guide.name);
        const experienceCell = createCell(guide.workExperience);
        const languagesCell = createCell(guide.language);
        const priceCell = createCell(guide.pricePerHour);

        const selectCell = document.createElement("td");
        const selectButton = document.createElement("button");
        selectButton.className = "btn btn-primary";
        selectButton.textContent = "Выбрать";
        selectButton.addEventListener("click", () => {
            selectedGuide = guide.id;
            renderGuides(guides);
        });

        // Добавляем ячейку с кнопкой выбора гида
        selectCell.appendChild(selectButton);

        // Добавляем все ячейки в строку
        row.appendChild(nameCell);
        row.appendChild(experienceCell);
        row.appendChild(languagesCell);
        row.appendChild(priceCell);
        row.appendChild(selectCell);

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    tableBody.appendChild(row);

    renderPagination(guides.length);
    tooltipInit();
}


function renderGuidesPagination(totalGuides) {
    const totalPages = Math.ceil(totalGuides / guidesPerPage);
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
        if (currentGuidePage > 1) {
            currentGuidePage--;
            renderGuides();
        }
    });
    prevPageItem.appendChild(prevPageLink);
    pagination.appendChild(prevPageItem);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("li");
        pageLink.className = "page-item";
        const link = document.createElement("a");
        link.className = "page-link";
        link.href = "#";
        link.textContent = i;

        link.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderGuides();
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
            currentGuidePage++;
            renderGuides();
        }
    });
    nextPageItem.appendChild(nextPageLink);
    pagination.appendChild(nextPageItem);

    paginationNav.appendChild(pagination);
    paginationList.appendChild(paginationNav);
}

// Добавьте код для загрузки данных маршрутов и отображения их в выпадающем списке
