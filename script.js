
// Події на сторінці
const eventCards = document.querySelectorAll(".event-card");

let myRoute = [];


// Дані всіх подій
const events = [
    { id: "event-1", title: "Робот проходить лабіринт", time: "10:00–10:30" },
    { id: "event-2", title: "Вебсторінка за 30 хвилин", time: "10:45–11:15" },
    { id: "event-3", title: "Математичний квест", time: "10:00–10:30" },
    { id: "event-4", title: "Міст із паперу", time: "11:30–12:00" },
    { id: "event-5", title: "Вода під мікроскопом", time: "10:45–11:15" },
    { id: "event-6", title: "Досліджуємо світло", time: "12:15–12:45" }
];


// Завантаження маршруту
function loadRoute() {
    const savedRoute = localStorage.getItem("myFestivalRoute");

    if (savedRoute) {
        myRoute = JSON.parse(savedRoute);
    }
}


// Збереження маршруту
function saveRoute() {
    localStorage.setItem("myFestivalRoute", JSON.stringify(myRoute));
}


// Додавання події
function addToRoute(id) {
    if (!myRoute.includes(id)) {
        myRoute.push(id);
        saveRoute();
        updateRoute();
    }
}


// Видалення події
function removeFromRoute(id) {
    myRoute = myRoute.filter(function(item) {
        return item !== id;
    });

    saveRoute();
    updateRoute();
}


// Оновлення маршруту
function updateRoute() {
    const myRouteList = document.getElementById("myRouteList");

    if (myRouteList) {
        myRouteList.innerHTML = "";

        if (myRoute.length === 0) {
            myRouteList.innerHTML = "<p>Твій маршрут поки порожній.</p>";
        }

        for (let i = 0; i < myRoute.length; i++) {
            const id = myRoute[i];

            for (let j = 0; j < events.length; j++) {
                if (events[j].id === id) {
                    const item = document.createElement("div");
                    item.className = "route-item";

                    const information = document.createElement("p");
                    information.textContent = events[j].title + " — " + events[j].time;

                    const button = document.createElement("button");
                    button.textContent = "Вилучити";
                    button.className = "remove-button";

                    button.addEventListener("click", function() {
                        removeFromRoute(id);
                    });

                    item.appendChild(information);
                    item.appendChild(button);

                    myRouteList.appendChild(item);
                }
            }
        }
    }

    // Зміна тексту кнопок
    eventCards.forEach(function(card, index) {
        const button = card.querySelector(".route-button");
        const id = "event-" + (index + 1);

        if (button) {
            if (myRoute.includes(id)) {
                button.textContent = "У маршруті";
            } else {
                button.textContent = "+ Мій маршрут";
            }
        }
    });
}


// Кнопки додавання подій
eventCards.forEach(function(card, index) {
    const id = "event-" + (index + 1);
    const button = card.querySelector(".route-button");

    card.dataset.id = id;

    if (button) {
        button.addEventListener("click", function() {
            if (myRoute.includes(id)) {
                removeFromRoute(id);
            } else {
                addToRoute(id);
            }
        });
    }
});


// Фільтри
const directionFilter = document.getElementById("directionFilter");
const classFilter = document.getElementById("classFilter");
const resetFilters = document.getElementById("resetFilters");

const eventCounter = document.getElementById("eventCounter");
const noResults = document.getElementById("noResults");

const directionGroups = document.querySelectorAll(".direction-group");

function filterEvents() {
    if (!directionFilter || !classFilter) {
        return;
    }

    let count = 0;

    eventCards.forEach(function(card) {
        const direction = card.dataset.direction;
        const classes = card.dataset.classes.split(",");

        let directionMatches = directionFilter.value === "all" ||
            direction === directionFilter.value;

        let classMatches = classFilter.value === "all" ||
            classes.includes(classFilter.value);

        if (directionMatches && classMatches) {
            card.hidden = false;
            count++;
        } else {
            card.hidden = true;
        }
    });

    // Приховування порожніх груп
    directionGroups.forEach(function(group) {
        const cards = group.querySelectorAll(".event-card:not([hidden])");

        if (cards.length === 0) {
            group.hidden = true;
        } else {
            group.hidden = false;
        }
    });

    if (eventCounter) {
        eventCounter.textContent = "Знайдено подій: " + count + " із " + eventCards.length;
    }

    if (noResults) {
        noResults.hidden = count !== 0;
    }
}


// Зміна фільтрів
if (directionFilter && classFilter) {
    directionFilter.addEventListener("change", filterEvents);
    classFilter.addEventListener("change", filterEvents);
}


// Скидання фільтрів
if (resetFilters) {
    resetFilters.addEventListener("click", function() {
        directionFilter.value = "all";
        classFilter.value = "all";

        filterEvents();
    });
}


// Очищення маршруту
const clearRoute = document.getElementById("clearRoute");

if (clearRoute) {
    clearRoute.addEventListener("click", function() {
        myRoute = [];
        saveRoute();
        updateRoute();
    });
}


// Запуск програми
loadRoute();
updateRoute();
filterEvents();
