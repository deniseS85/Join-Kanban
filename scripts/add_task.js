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

/**
 * initialization
 */
async function init() {
    await includeHTML();
    setURL('https://denise-siegl.developerakademie.net/join_kanban/smallest_backend_ever');
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
 * create new Category
 */
async function createNewCategory() {
    let category = document.getElementById('new-category-input').value;
    let error = document.getElementById('error-new_category');

    if (category.length > 0){
        if (selectedCategoryColor) {
            createNewCategoryName(category, error);
        } else {
            error.innerHTML = 'Select a Color for new Category';
        }
    }  else {
        error.innerHTML = 'Name required';
    } 
    categoryArray.push ({
        name: category,
        color: selectedCategoryColor
    });
    renderCategoryDropdown();
    await addToDBCategory();
}

/**
 * check if new Category Name already exist
 * @param {string} category - Value from new Category Input Box
 * @param {div} error - error div for error messages
 */
function createNewCategoryName(category, error) {
    if(searchNameIndexInArray(category, categoryArray) < 0) {
        selectedCategory = {'name': category, 'color': selectedCategoryColor};
        unselectCategoryColor();
        clearNewCategory();

        document.getElementById('select-category').innerHTML = selectedCategoryTemplate(category);
        error.innerHTML = '';
        renderCategoryDropdown();
        } else {
            error.innerHTML = 'Category already exist';
        }
}

/**
 * display selected Category Name and Color on select box
 * @param {number} i - Category Array Index
 */
function selectCategory(i) {
    selectedCategoryColor = categoryArray[i]['color'];
    document.getElementById('select-category').innerHTML = selectedCategoryTemplate(categoryArray[i]['name']);

    openDropdownCategory();
    selectedCategory = {'name': categoryArray[i]['name'], 'color': selectedCategoryColor};

    checkCategory();
}

/**
 * change Color style (select and unselect) under Category Dropdown/Input
 * @param {number} i - index of Category Array
 */
function selectCategoryColor(i) {
    selectedCategoryColor = categoryArray[i]['color'];

    unselectCategoryColor();
    document.getElementById(`category-color-${i}`).classList.add('category-colors-selected');
}

/**
 * remove border from Category Colors under Categroy input (5 Colors)
 */
function unselectCategoryColor() {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`category-color-${i}`).classList.remove('category-colors-selected');
    }
}

/**
 * click automaticly Accept Button in Inputbox after press Enter
 * @param {*} event - Keyboard Event
 */
function colorInputEnter(event) {
    if (event.key == "Enter") {
        createNewCategory();
    }
}

/**
 * add selected Category to DB, if it doesn't exist
 */
async function newCategoryPush() {
    let categoryIndex = searchNameIndexInArray(selectedCategory['name'], categoryArray);
    if(categoryIndex < 0){
        categoryIndex = categoryArray.length;
        categoryArray.push(selectedCategory);
        await addToDBCategory();
    }
    return categoryIndex;
}

/**
 * create/remove check mark in checkbox and push/splice Contact to assignToArray
 * @param {nr} i - index of checked in/out Contact
 */
function selectContact(i) {
    let checkbox = document.getElementById(`assignCheckbox-${i}`);

    if(checkbox.innerHTML.length > 0) {
        checkbox.innerHTML = '';
        let nrInAssignToArray = searchIndexInArrayEmail(usersArray[i]['email'], assignToArray);
        assignToArray.splice(nrInAssignToArray, 1);
        //console.log('delete', i, 'from assignedToArray');
    } else {
        checkbox.innerHTML = '<div class="assign-checkbox-selected"></div>';
        if(i < (usersArray.length)) {
            if(searchIndexInArray(usersArray[i]['email'], assignToArray) < 0) {
                assignToArray.push(usersArray[i]['email']);
            }
        }
    }
    updateAssignedToHeadline();
}

/**
 * Expand 'Assigned To' Dropdown
 */
function showCheckboxesAssignedTo() {
    if (!expandedAssignedTo) {
        document.getElementById("checkboxes-assigned_to").classList.remove('dropdown-collapse');
        document.getElementById("checkboxes-assigned_to").classList.add('expand');
        document.getElementById("select-assign_to").classList.add('selectBox-focus');
        expandedAssignedTo = true;
    } else {
        closeDropdownAssignedTo();
    }
}

/**
 * Close 'Assigned to' Dropdown
 */
function closeDropdownAssignedTo() {
    setTimeout(() => {
        document.getElementById("checkboxes-assigned_to").classList.add('dropdown-collapse');
        document.getElementById("select-assign_to").classList.remove('selectBox-focus');
    }, '255')
    document.getElementById("checkboxes-assigned_to").classList.remove('expand');
    expandedAssignedTo = false;
}

/**
 * show 'invite new contact' input
 */
function addTaskInviteContact() {
    document.getElementById('assign_to-container').classList.add('d-none');
    document.getElementById('new-contact').classList.remove('d-none');
}

/**
 * close 'invite new contact' input
 */
function clearInviteContact() {
    document.getElementById('new-contact-input').value = '';
    document.getElementById('error-invite_contact').innerHTML = '';
    document.getElementById('error-invite_contact').classList.remove('error-container');
    document.getElementById('assign_to-container').classList.remove('d-none');
    document.getElementById('new-contact').classList.add('d-none');
}

/**
 * invite new contact
 */
function sendInvite() {
    let email = document.getElementById('new-contact-input').value.toLowerCase();
    let error = document.getElementById('error-invite_contact');
    let verification = validateEmail(email);
    
    if(Boolean(verification) == true) {
        sendInviteSuccessfully(email);
    } else {
        document.getElementById('error-invite_contact').classList.add('error-container');
        error.innerHTML = 'Email is invalid';
    }
}

/**
 * push email to usersArray and assignToArray if not exist in Array.
 * clear Contact input and render Assign Dropbox with (new) Contacts
 * @param {string} email - email address
 */
function sendInviteSuccessfully(email) {
    let emailContact = {'email': email};
    let contactArrayIndex = searchIndexInArrayEmail(email, usersArray);

        if(contactArrayIndex < 0) {
            usersArray.push(emailContact);
            if(searchIndexInArray(email, assignToArray) < 0) {
                assignToArray.push(email);
            }
        } else if(contactArrayIndex >= 0) {
            if(searchIndexInArrayEmail(email, assignToArray) < 0) {
                assignToArray.push(email);
            }
        }

        clearInviteContact();
        renderAssignDropdown();
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
        urgent.classList.add('prio-selected');
        urgent.classList.add('prio-urgent');
        urgent.classList.remove('prio-element');
    } else if(nr == 2) {
        medium.classList.add('prio-selected');
        medium.classList.add('prio-medium');
        medium.classList.remove('prio-element');
    } else if (nr == 3) {
        low.classList.add('prio-selected');
        low.classList.add('prio-low');
        low.classList.remove('prio-element');
    }
}

/**
 * remove Prio div selected Style
 * @param {Object} urgent - div container with Prio urgent content
 * @param {Object} medium - div container with Prio medium content
 * @param {Object} low - div container with Prio low content
 */
function clearPrioSelection(urgent, medium, low) {
    urgent.classList.remove('prio-selected');
    urgent.classList.remove('prio-urgent');
    urgent.classList.add('prio-element');

    medium.classList.remove('prio-selected');
    medium.classList.remove('prio-medium');
    medium.classList.add('prio-element');

    low.classList.remove('prio-selected');
    low.classList.remove('prio-low');
    low.classList.add('prio-element');
}

/**
 * push input 'Add new subtask' to Array subtasks and render Subtasks under Input
 */
function sendNewSubtask() {
    let newSubtask = document.getElementById('new-subtask');
    let error = document.getElementById('error-subtasks');

    if(newSubtask.value.length >= 2) {
        let subtaskArray = {'name': newSubtask.value, 'complete': false};
        subtasks.push(subtaskArray);
        newSubtask.value = '';
        error.innerHTML = '';
        renderSubtasks();
        closeSubtaskCheckmark();
    } else {
        error.innerHTML = 'Subtask need minimum 2 Letters';
    }
}

/**
 * clear Subtask Input and lose focus
 */
function clearNewSubtask() {
    document.getElementById('new-subtask').value = '';
    document.getElementById('error-subtasks').innerHTML = '';
    closeSubtaskCheckmark();
}

/**
 * focus Subtask Input after click
 */
function focusSubtaskInput() {
    document.getElementById("subtask-add-btn").addEventListener("click", () => {
        document.getElementById("new-subtask").focus();
      });
}

/**
 * hide Subtask Input check- and x-mark if input empty 
 */
function loseSubtaskFocus() {
    if (document.getElementById('new-subtask').value.length < 1) {
        closeSubtaskCheckmark();
    }
}

/**
 * hidde add mark and show close- and checkmark in Subtask input
 */
function showSubtaskCheckmark() {
    document.getElementById('subtask-add-btn').classList.add('d-none');
    document.getElementById('subtask-clear-check-btn').classList.remove('d-none');
}

/**
 * hidde close- and checkmark and show add mark in Subtask input
 */
function closeSubtaskCheckmark() {
    document.getElementById('subtask-add-btn').classList.remove('d-none');
    document.getElementById('subtask-clear-check-btn').classList.add('d-none');
}

/**
 * delete element 'i' in substrings (json)
 * @param {number} i - index of substrings
 */
function deleteSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
    if (subtasks.length == 0) {
        document.getElementById('subtask-container').style.maxHeight = '0';
    }
}

/**
 * show/remove checked checkbox and add/remove complete on subtask
 * @param {number} i - index of substrings
 */
function changeSubtaskCheckbox(i) {
    if (Boolean(subtasks[i]['complete']) == false) {
        subtasks[i]['complete'] = true;
    } else {
        subtasks[i]['complete'] = false;
    }
    checkCheckboxValue(i);
}

/**
 * click automaticly Accept Button in Inputbox after press Enter
 * @param {*} event - Keyboard Event
 */
function newSubtaskInputClickPress(event) {
    if (event.key == "Enter") {
        document.getElementById("add-subtask-btn").click();
    }
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

