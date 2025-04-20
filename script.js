// Datum anzeigen
function setDate() {
    const dateElement = document.getElementById('date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('de-DE', options);
}

// Checkboxes speichern
function saveState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    checkboxes.forEach(box => {
        state[box.dataset.task] = box.checked;
    });
    localStorage.setItem('todoState', JSON.stringify(state));
    checkCompletion();
}

// Checkboxes laden
function loadState() {
    const savedDate = localStorage.getItem('todoDate');
    const todayDate = new Date().toLocaleDateString('de-DE');

    if (savedDate !== todayDate) {
        // Neuer Tag - Alles zurücksetzen
        localStorage.removeItem('todoState');
        localStorage.removeItem('todoTasks');
        localStorage.setItem('todoDate', todayDate);
    }

    const savedTasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    const todoList = document.getElementById('todo-list');

    savedTasks.forEach(taskName => {
        createTaskElement(taskName, false);
    });

    const state = JSON.parse(localStorage.getItem('todoState')) || {};
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(box => {
        if (state.hasOwnProperty(box.dataset.task)) {
            box.checked = state[box.dataset.task];
            toggleCompleted(box);
        }
        box.addEventListener('change', function() {
            toggleCompleted(box);
            saveState();
        });
    });

    checkCompletion();
}

// Aufgabe erstellen
function createTaskElement(taskName, save = true) {
    const todoList = document.getElementById('todo-list');
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.task = taskName.toLowerCase().replace(/\s+/g, '-');
    input.addEventListener('change', function() {
        toggleCompleted(input);
        saveState();
    });
    li.appendChild(input);
    li.appendChild(document.createTextNode(taskName));
    todoList.appendChild(li);

    if (save) {
        const savedTasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        savedTasks.push(taskName);
        localStorage.setItem('todoTasks', JSON.stringify(savedTasks));
    }
}

// Aufgabe hinzufügen
function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskName = newTaskInput.value.trim();
    if (taskName !== '') {
        createTaskElement(taskName);
        newTaskInput.value = '';
        saveState();
    }
}

// Aufgabe Animation
function toggleCompleted(checkbox) {
    if (checkbox.checked) {
        checkbox.parentElement.classList.add('completed');
    } else {
        checkbox.parentElement.classList.remove('completed');
    }
}

// Erfolg prüfen
function checkCompletion() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(box => box.checked);
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = allChecked ? 'block' : 'none';
}

// Manuelles Zurücksetzen
function resetList() {
    localStorage.removeItem('todoState');
    localStorage.removeItem('todoTasks');
    localStorage.setItem('todoDate', new Date().toLocaleDateString('de-DE'));
    location.reload();
}

setDate();
loadState();
