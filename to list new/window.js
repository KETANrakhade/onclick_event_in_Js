window.onload = () => {
    const el = document.getElementById('customDate');
    el.innerHTML = (new Date).toISOString().split("T")[0];
};

let clickedDate = new Date().toISOString().split("T")[0];

const logosSlide = document.querySelector(".logos-slide");
const copy = logosSlide.cloneNode(true);
document.querySelector(".logo-slider").appendChild(copy);

let completedCount = 0;
let calendar;

function saveTasksToLocalStorage() {
    const events = calendar.getEvents().map(event => ({
        title: event.title,
        start: event.startStr,
        backgroundColor: event.backgroundColor || '',
        textColor: event.textColor || ''
    }));
    localStorage.setItem("tasks", JSON.stringify(events));
}

function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(task => {
        calendar.addEvent({
            title: task.title,
            start: task.start,
            allDay: true,
            backgroundColor: task.backgroundColor,
            textColor: task.textColor
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        droppable: true,
        events: [],

        dateClick: function (info) {
            clickedDate = info.dateStr;
            const events = calendar.getEvents().filter(event =>
                event.startStr === clickedDate
            );

            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            const dateHeading = document.createElement("h3");
            dateHeading.textContent = `${clickedDate}`;
            taskList.appendChild(dateHeading);

            if (events.length === 0) {
                const li = document.createElement("li");
                li.textContent = "No tasks on this date.";
                taskList.appendChild(li);
            } else {
                events.forEach(event => {
                    const li = document.createElement("li");
                    const isChecked = event.backgroundColor === "green";
                    const isStarred = event.backgroundColor === "pink";
                    li.innerHTML = `
                        <span>
                            <input type="checkbox" class="check-boxes" onchange="toggleComplete(this)" ${isChecked ? 'checked' : ''}/>
                            ${event.title}
                        </span>
                        <span class="star" onclick="toggleStar(this)">${isStarred ? '★' : '☆'}</span>
                    `;
                    taskList.appendChild(li);
                });
            }
        }
    });

    calendar.render();
    loadTasksFromLocalStorage();
});

new FullCalendar.Draggable(document.getElementById('taskList'), {
    itemSelector: 'li',
    eventData: function (el) {
        return {
            title: el.innerText,
        };
    }
});

function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();
    if (title === "") return;

    const selected = new Date(clickedDate);
    const today = new Date();

    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected < today) return;

    const li = document.createElement("li");
    li.innerHTML = `
        <span>
            <input type="checkbox" class="check-boxes" onchange="toggleComplete(this)" />
            ${title}
        </span>
        <span class="star" onclick="toggleStar(this)">☆</span>
    `;
    document.getElementById("taskList").appendChild(li);

    calendar.addEvent({
        title: title,
        start: clickedDate,
        allDay: true,
    });

    saveTasksToLocalStorage();
    input.value = "";
}

function updateCounts() {
    document.getElementById("completedCount").textContent = completedCount;
}

function toggleComplete(checkbox) {
    const li = checkbox.closest("li");
    const span = checkbox.parentElement;
    const taskTitle = span.textContent.trim();

    if (checkbox.checked) {
        document.getElementById("completedTasks").appendChild(li);
        completedCount++;
    } else {
        document.getElementById("taskList").appendChild(li);
        completedCount--;
    }

    const events = calendar.getEvents();
    events.forEach(event => {
        if (event.title === taskTitle) {
            if (checkbox.checked) {
                event.setProp("backgroundColor", "green");
                event.setProp("textColor", "white");
            } else {
                event.setProp("backgroundColor", "");
                event.setProp("textColor", "");
            }
        }
    });

    updateCounts();
    saveTasksToLocalStorage();
}

function toggleStar(star) {
    const span = star.previousElementSibling;
    const taskTitle = span.textContent.trim();

    if (star.textContent === "★") {
        star.textContent = "☆";
        const events = calendar.getEvents();
        events.forEach(event => {
            if (event.title === taskTitle) {
                event.setProp('backgroundColor', '');
                event.setProp('textColor', '');
            }
        });
    } else {
        star.textContent = "★";
        const events = calendar.getEvents();
        events.forEach(event => {
            if (event.title === taskTitle) {
                event.setProp('backgroundColor', 'pink');
                event.setProp('textColor', 'black');
            }
        });
    }
    saveTasksToLocalStorage();
}

document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
});

function showAllTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const tasks = calendar.getEvents();

    if (tasks.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No tasks found.";
        taskList.appendChild(li);
        return;
    }

    tasks.forEach(event => {
        const isChecked = event.backgroundColor === "green";
        const isStarred = event.backgroundColor === "pink";
        const li = document.createElement("li");
        li.innerHTML = `
            <span>
                <input type="checkbox" class="check-boxes" onchange="toggleComplete(this)" ${isChecked ? 'checked' : ''}/>
                ${event.title}
            </span>
            <span class="star" onclick="toggleStar(this)">${isStarred ? '★' : '☆'}</span>
        `;
        taskList.appendChild(li);
    });
}

function clearTaskList() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
}
