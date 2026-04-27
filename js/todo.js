const STORAGE_KEY = "student_task_list";

const form = document.querySelector("#todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("count");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = loadTodos();

function loadTodos() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (!savedTasks) {
            return [];
        }
        const parsedTasks = JSON.parse(savedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
        return [];
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function updateCount() {
    const remaining = todos.filter((task) => !task.done).length;
    const total = todos.length;
    count.textContent = `${remaining} still to do / ${total} total`;
    emptyState.style.display = total === 0 ? "block" : "none";
}

function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = todo.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", "Mark task complete");
    checkbox.addEventListener("change", () => {
        todo.done = checkbox.checked;
        saveTodos();
        renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Remove";
    deleteBtn.addEventListener("click", () => {
        todos = todos.filter((task) => task.id !== todo.id);
        saveTodos();
        renderTodos();
    });

    li.append(checkbox, text, deleteBtn);
    return li;
}

function renderTodos() {
    list.innerHTML = "";
    todos.forEach((todo) => list.appendChild(createTodoElement(todo)));
    updateCount();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
        return;
    }

    todos.unshift({
        id: crypto.randomUUID(),
        text,
        done: false,
    });

    input.value = "";
    input.focus();
    saveTodos();
    renderTodos();
});

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((task) => !task.done);
    saveTodos();
    renderTodos();
});

renderTodos();