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


