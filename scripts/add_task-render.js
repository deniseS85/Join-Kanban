/**
 * call render function for Category Dropdown and Color
 */
function renderCategory() {
    renderCategoryDropdown();
    renderCategoryColors();
}


/**
 * render Category in Category Dropdown
 */
function renderCategoryDropdown() {
    let categoryArea = document.getElementById('checkbox-category');
    categoryArea.innerHTML = '';

    for (let i = 0; i < categoryArray.length; i++) {
        const element = categoryArray[i];
        categoryArea.innerHTML += categoryDropdownTemplate(i, element);
    }
}


/**
 * render Colors for Category
 */
function renderCategoryColors() {
    let categoryColorArea = document.getElementById('category-color');
    categoryColorArea.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const element = categoryArray[i];
        categoryColorArea.innerHTML += `
        <div id="category-color-${i}" onclick="selectCategoryColor(${i})" style="background-color: ${element['color']}"></div>`;
    }
}


/**
 * template for render Category. fill Category Dropdown
 * @param {number} i - index
 * @param {object} element - Array Element
 * @returns 
 */
function categoryDropdownTemplate(i, element) {
    return `
    <div class="checkboxes-element" onclick="selectCategory(${i})">
        <div id="category-${i}" class="category-color" style='background-color: ${element['color']}'></div>
        ${element['name']}
    </div>`;
}


/**
 * Template to display selected Category Name and Color on select box
 * @param {string} category - Category Name
 * @returns 
 */
function selectedCategoryTemplate(category) {
    return `
    <div style="display: flex; align-items: center; gap: 10px;">
        <div class="category-color" style="background-color: ${selectedCategoryColor}"></div>
        ${category}
    </div>
    <img src="./assets/img/arrow-down.png" alt="arrow down">`;
}


/**
 * render Assigned To Dropdown with Contact elements
 */
function renderAssignDropdown() {
    let assignArea = document.getElementById('checkbox-assigned_to');
    assignArea.innerHTML = '';

    for (let i = 0; i < usersArray.length; i++) {
        let element;
        if(usersArray[i]['firstname'] && usersArray[i]['lastname']) {
            element = usersArray[i]['firstname'] +' '+ usersArray[i]['lastname'];
        } else {
            element = usersArray[i]['email'];
        }

        assignArea.innerHTML += renderAssignDropdownTemplate(i, element);
        if(searchIndexInArray(usersArray[i]['email'], assignToArray) >= 0) {
            selectContact(i);
        }
    }
}


/**
 * Template for Assign Dropdown
 * @param {number} i - index 
 * @param {string} element - Contact name or email
 * @returns innerHTML
 */
function renderAssignDropdownTemplate(i, element) {
    return `
    <div class="add-contact checkboxes-element" onclick="selectContact(${i})">
        <span class="assigned_to-element">${element}</span>
        <div id="assignCheckbox-${i}" class="assign-checkbox"></div>
    </div>`;
}


/**
 * show how many People Assigned to the Task
 */
function updateAssignedToHeadline() {
    let txt = document.getElementById('assigned_to-headline');
    
    if(assignToArray.length > 0) {
        txt.innerHTML = `Assigned to ${assignToArray.length} people`;
    } else {
        txt.innerHTML = 'Select contacts to assign';
    }
}


/**
 * render all subtasks
 */
function renderSubtasks() {
    let subtaskContainer = document.getElementById('subtask-container');
    subtaskContainer.innerHTML = '';

    for(i=0; i < subtasks.length; i++) {
        renderSubtasksTemplate(subtaskContainer, i);
        checkCheckboxValue(i);
        subtaskContainer.style.maxHeight = '130px';
    }
}


/**
 * Template to render Subtasks
 * @param {Object} subtaskContainer - Element with Id 'subtask-container'
 * @param {number} i - index of substrings
 */
function renderSubtasksTemplate(subtaskContainer, i) {
    
    subtaskContainer.innerHTML += `
    <div class="subtask-element subtask-board">
        <div class="subtask-name">
            <div id="subtask-checkbox-${i}" onclick="changeSubtaskCheckbox(${i})"></div>
            <span style="cursor: text">${subtasks[i]['name']}<span>
        </div>
        <div class="subtask-delete" onclick="deleteSubtask(${i})">
            ✗
        </div>
    </div>`;
}