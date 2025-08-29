
window.onload = () => {
    const el = document.getElementById('customDate');
    el.innerHTML = (new Date).toISOString().split("T")[0];
};

let clickedDate = new Date().toISOString().split("T")[0];;


const logosSlide = document.querySelector(".logos-slide");
const copy = logosSlide.cloneNode(true);
document.querySelector(".logo-slider").appendChild(copy);


let completedCount = 0;
let calendar;


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
                    li.innerHTML = `
                <span>
                    <input type="checkbox" class="check-boxes" onchange="toggleComplete(this)"/>
                    ${event.title}
                </span>
                <span class="star" onclick="toggleStar(this)">☆</span>
            `;
                    taskList.appendChild(li);
                });
            }

        }

    });

    calendar.render();
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
    today.setHours(0, 0, 0,  0);

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

    input.value = "";
}
function updateCounts() {
    document.getElementById("completedCount").textContent = completedCount;
}

function toggleComplete(checkbox) {
    const li = checkbox.closest("li");

    const span = checkbox.parentElement;
    const taskTitle = span.textContent.trim();

function updateCounts(){
    document.getElementById("completedCount").textContent = completedCount;
    const li = checkbox.closest
}

   
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
                star.textContent = "★";
            }
        });
    }
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
        const li = document.createElement("li");
        li.innerHTML = `
            <span>
                <input type="checkbox" class="check-boxes" onchange="toggleComplete(this)"/>

                ${event.title}
            </span>
            <span class="star" onclick="toggleStar(this)">☆</span>
        `;
        taskList.appendChild(li);
    });
}
function clearTaskList() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
}