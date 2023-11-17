var usersArray = []; // Users from - for Database
var categoryArray = []; // Category from - for Database
var taskArray = []; // Tasks from - for Database
var expandedAssignedTo = false; // boolean for Assigned To Dropdown
var expandedCategory = false; // boolean for Category Dropdown
var selectedCategoryColor = null; // color name for new Category
var selectedCategory = []; // selected Category for pushing in task Array
var assignToArray = []; // Task assign to array
let assignToArrayIndex = [] // Task assign to array (users index)
var prio; // Task prio
var subtasks = []; // Task Subtasks


async function init() {
    await includeHTML();
    setURL('https://denise.selfcoders.com/join_kanban/smallest_backend_ever');
    generateNav();
    generateHeader();
    initAddTaskElements();
}


/**
 * initalizate Add Task Elements, like Users or Category
 */
async function initAddTaskElements() {
    await loadFromDB(); // load Users and Category from Database
    renderCategory();
    checkAssignedToUser();
    renderAssignDropdown();
    setDueDateMinToday(); // set today as min. Date
}


/**
 * create Task if all required Fields filled
 */
async function createTask() {
    let title = checkTitle();
    let description = checkDescription();
    let categoryIndex = await checkCategory() + 1;
    let dueDate = getDueDate();
    checkPrio();

    if(title && description && prio && dueDate && categoryIndex) {

        assignToArray.forEach(element => { // push usersArray index in assignedToArrayIndex
            let userIndex = searchIndexInArrayEmail(element, usersArray);
            if(userIndex >= 0) {
                assignToArrayIndex.push(userIndex);
            }
        });
        sendTaskToDB(title, description, categoryIndex, dueDate);
    }
}


/**
  * send Task to DB and go to Board
  * @param {string} title - input of title inputbox
  * @param {string} description - input of description inputbox
  * @param {number} categoryIndex - index of selected Category in categoryArray
  * @param {date} dueDate - input of due date inputbox
  */
async function sendTaskToDB(title, description, categoryIndex, dueDate) {
    if(searchIndexInArrayTasks(title, taskArray) < 0) {    
        let status = checkStatus();
        let task = {'title': title, 'description': description, 'category': categoryIndex, 'assigned_to': assignToArrayIndex, 'due_date': dueDate, 'prio': prio, 'status': status, 'subtask': subtasks};
        taskArray.push(task);
        await addToDBTask();
        createTaskMessage();
    } else {
        document.getElementById('error-title').innerHTML = 'Title already exist as a task!';
    }
}


/**
 * Expand 'Category' Dropbox
 */
function openDropdownCategory() {
    if (!expandedCategory) {
        document.getElementById("checkboxes-category").classList.remove('dropdown-collapse');
        document.getElementById("checkboxes-category").classList.add('expand');
        document.getElementById("select-category").classList.add('selectBox-focus');
        expandedCategory = true;
    } else {
        closeDropdownCategory();
    }
}


/**
 * Close 'Category' Dropdown
 */
function closeDropdownCategory() {
    setTimeout(() => {
        document.getElementById("checkboxes-category").classList.add('dropdown-collapse');
        document.getElementById("select-category").classList.remove('selectBox-focus');
    }, '255')
    document.getElementById("checkboxes-category").classList.remove('expand');
    expandedCategory = false;
}


/**
 * show 'new Category' input
 */
function addTaskNewCategory() {
    document.getElementById('category-container').classList.add('d-none');
    document.getElementById('new-category').classList.remove('d-none');
    document.getElementById('category-color').classList.remove('d-none');
}


/**
 * close 'new Category'
 */
function clearNewCategory() {
    document.getElementById('new-category-input').value = '';
    document.getElementById('error-new_category').innerHTML = '';
    document.getElementById('category-container').classList.remove('d-none');
    document.getElementById('new-category').classList.add('d-none');
    document.getElementById('category-color').classList.add('d-none');
    document.getElementById("checkboxes-category").classList.add('dropdown-collapse');
    document.getElementById("select-category").classList.remove('selectBox-focus');
    document.getElementById("checkboxes-category").classList.remove('expand');
    document.getElementById("select-category").classList.remove('selectBox-focus');
    unselectCategoryColor();
    expandedCategory = false;
}


/**
 * click automaticly Accept Button in Inputbox after press Enter
 * @param {*} event - Keyboard Event
 */
function inviteInputEnter(event) {
    if (event.key == "Enter") {
        sendInvite();
    }
}


/**
 * set Due Date minimum to today
 */
function setDueDateMinToday() {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("due-date").min = today;
}


/**
 * unselect Prio Button and select klicked Prio, if not already selected
 * @param {number} nr - 1=urgent, 2=medium, 3=low
 */
function setPrio(nr) {
    let urgent = document.getElementById('prio-urgent');
    let medium = document.getElementById('prio-medium');
    let low = document.getElementById('prio-low');

    let compare = compareWithOldSelection(nr);
    clearPrioSelection(urgent, medium, low);

    if(Boolean(compare) == false) {
        showSelectedPrio(nr, urgent, medium, low);
    } else {
        nr = null;
    }
    prio = nr;
}


/**
 * add Class on selected Prio
 * @param {number} nr - Prio number
 * @param {object} urgent - div container with Prio urgent content
 * @param {object} medium - div container with Prio medium content
 * @param {object} low - div container with Prio low content
 */
function showSelectedPrio(nr, urgent, medium, low) {
    if(nr == 1) {
        renderPrio(urgent, 'urgent');
    } else if(nr == 2) {
        renderPrio(medium, 'medium');
    } else if (nr == 3) {
        renderPrio(low, 'low');
    }
}


function renderPrio(el, prio) {
    el.classList.add(`prio-selected`);
    el.classList.add(`prio-${prio}`);
    el.classList.remove(`prio-element`);
}

/**
 * remove Prio div selected Style
 * @param {Object} urgent - div container with Prio urgent content
 * @param {Object} medium - div container with Prio medium content
 * @param {Object} low - div container with Prio low content
 */
function clearPrioSelection(urgent, medium, low) {
    renderClearPrio(urgent, 'urgent');
    renderClearPrio(medium, 'medium');
    renderClearPrio(low, 'low');
}


function renderClearPrio(el, prio) {
    el.classList.remove(`prio-selected`);
    el.classList.remove(`prio-${prio}`);
    el.classList.add(`prio-element`);
}


/**
 * set mouseover effect on Clear Button
 */
function mouseoverClearTaskBtn() {
    document.getElementById('clear-task-btn').classList.add('clear-task-btn');
}


/**
 * remove mouseover effect on Clear Button
 */
function mouseleaveClearTaskBtn() {
    document.getElementById('clear-task-btn').classList.remove('clear-task-btn');
}


/**
 * clear formular
 */
function clearTasks() {
    let input = ['new_task-title', 'new_task-description', 'due-date', 'new-subtask'];
    let html = ['error-title', 'error-description', 'error-due_date', 'error-prio', 'error-new_category', 'error-invite_contact', 'error-subtasks', 'subtask-container'];

    input.forEach(element => {
        document.getElementById(element).value = '';
    });

    html.forEach(element => {
        document.getElementById(element).innerHTML = '';
    });
    clearVariables();
    clearPrioSelection(document.getElementById('prio-urgent'), document.getElementById('prio-medium'), document.getElementById('prio-low'));
    clearDropdowns();
    clearNewSubtask()
}


/**
 * clear Assigned to and Category Dropdown
 */
async function clearDropdowns() {
    clearNewCategory()
    document.getElementById('select-category').innerHTML = `Select task Category
    <img src="./assets/img/arrow-down.png" alt="arrow down" class="not-markable">`;

    await loadFromDB();
    renderAssignDropdown();
    document.getElementById('assigned_to-headline').innerHTML = `Select contacts to assign`;
}


/**
 * remove all global variable inputs
 */
function clearVariables() {
    prio = '';
    selectedCategory = [];
    assignToArray = [];
    assignToArrayIndex = [];
    subtasks = [];
}


/**
 * show 'Task added' for 3 sec. and disable main container
 */
function createTaskMessage() {
    disableBody();
    disableMainContainer();
   
    document.getElementById('task_added').classList.remove('d-none');

    setTimeout(() => {
        window.location = ("./board.html");
    }, '1000')
}


/**
 * disable Body
 */
function disableBody() {
    try {
        let body = document.getElementById("body");
    } catch {}

    if(body) {
        body.disabled = true;
        var nodes = body.getElementsByTagName('*');

        for(var i = 0; i < nodes.length; i++){
            nodes[i].disabled = true;
        }
    }
}


/**
 * disable Main Container
 */
function disableMainContainer() {
    let main = document.getElementById("add_task-main");
    main.disabled = true;
    var nodes = main.getElementsByTagName('*');

    for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = true;
    }

    main.classList.add('no-events');
}


/**
 * include HTML function
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute('w3-include-html');
        let resp = await fetch(file);
        if(resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found.';
        }
    }
}


/**
 * Close all Dropdowns
 */
function closeDropdown() {
    closeDropdownCategory();
    closeDropdownAssignedTo();
}


/**
 * Stop Closing Dropdown Boxes on this Element
 */
function stopClosing() {
    event.stopPropagation();
}


// ========== DATABASE ==========
async function loadFromDB() {
    await downloadFromServer();
    usersArray = JSON.parse(backend.getItem('users')) || [];
    categoryArray = JSON.parse(backend.getItem('categories')) || [];
    taskArray = JSON.parse(backend.getItem('tasks')) || [];
}

async function addToDBCategory() {
    await backend.setItem('categories', JSON.stringify(categoryArray));
}

async function addToDBTask() {
    await backend.setItem('tasks', JSON.stringify(taskArray));
}

