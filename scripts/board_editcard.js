
/**
 * open Drop-Box of Edit-Card
 * @param {this} el 
 */
function openAssignedDropBox(el) {
    if (!isOpenAssignedDropbox) { 
    el.closest('.assign-content').querySelector('.checkbox').classList.remove('dropdown-collapse');
    el.closest('.assign-content').querySelector('.checkbox').classList.add('expand-assign');
    el.closest('.assign-content').querySelector('.dropdown-select').classList.add('selectBox-focus');
    isOpenAssignedDropbox = true;
    } else {
        closeAssignedDropBox(el);
    }
}

/**
 * close Drop-Box of Edit-Card
 * @param {this} el 
 */
function closeAssignedDropBox(el) {
    setTimeout(() => { 
        el.closest('.card-inkl-popups').querySelector('.checkbox').classList.add('dropdown-collapse');
        el.closest('.card-inkl-popups').querySelector('.dropdown-select').classList.remove('selectBox-focus');
    }, 255);
    el.closest('.card-inkl-popups').querySelector('.checkbox').classList.remove('expand-assign');
    isOpenAssignedDropbox = false;
}

/**
 * help function to find position in array by means of keyname and keyvalue
 * @param {array} array 
 * @param {string} key 
 * @param {value} value 
 * @returns 
 */
function getPositionByKeyInArray(array, key, value) {
    let findIndex = findByKey(key, value);
    return array.findIndex(findIndex);
}

/**
 * show contacts in DropBox 
 */
function assignDropdownEditCard() {
    let checkboxContent = document.querySelectorAll('.checkbox-container');

    for (let j = 0; j < checkboxContent.length; j++) {
       checkboxContent[j].innerHTML = '';
       
       let taskTitle = checkboxContent[j].closest('.popup-card-content').querySelector('input.input-edit-overlay').value;
       let taskID = getPositionByKeyInArray(taskArray, 'title', taskTitle);

        for (let i = 0; i < usersArray.length; i++) {
            let assignUser;

            if (usersArray[i]['firstname'] && usersArray[i]['lastname']) {
                assignUser = usersArray[i]['firstname'] +' '+ usersArray[i]['lastname'];
            } else {
                assignUser = usersArray[i]['email'] ;
            }
            checkboxContent[j].innerHTML += renderAssignDropdownEditCard(i, taskID, assignUser);
        }
        initAssignContact(taskID);
        updateAssignedNumber(checkboxContent[j], taskID);
    }     
}

/**
 * show all contacts in dropbox per card
 * @param {number} assignUserID position contacts (index)
 * @param {number} taskID position of card in JSON (index)
 * @param {string} assignUser firstname, lastname
 * @returns HTML
 */
function renderAssignDropdownEditCard(assignUserID, taskID, assignUser) {
    return /*html*/`
        <div class="add-contact checkboxes-element" onclick="updateCheckbox(this, ${assignUserID}, ${taskID})">
            <span class="assigned_to-element">${assignUser}</span>
            <div id="assignCheckBox-${assignUserID}-${taskID}" class="assign-checkbox"></div>
        </div>`;
}

/**
 * the people who are already selected, the radio button is selected
 * @param {index} taskID position of card in JSON
 */
function initAssignContact(taskID) {
    let assigned_to = taskArray[taskID]['assigned_to'];

    for (let i = 0; i < assigned_to.length; i++) {
        let checkboxEdit = document.getElementById(`assignCheckBox-${assigned_to[i]}-${taskID}`);
        checkboxEdit.innerHTML = '<div class="assignCheckBox-selected"></div>';
    }
}

/**
 * add or remove 'selected' class of checkbox
 * @param {number} assignUserID index of contact
 * @param {number} taskID index of card
 */
async function selectAssignContact(assignUserID, taskID) {
    let checkboxEdit = document.getElementById(`assignCheckBox-${assignUserID}-${taskID}`);

    if (checkboxEdit.innerHTML.length > 0) {
        checkboxEdit.innerHTML = '';
    } else {
        checkboxEdit.innerHTML = '<div class="assignCheckBox-selected"></div>';
    }

    // delete not registered user from usersArray, if is deselected
    let index = usersArray[assignUserID]['initials'].indexOf('@');
    if (index > -1 && checkboxEdit.innerHTML == '') {
        usersArray.splice(assignUserID, 1);
    }
    await addToDBUsers();
    assignDropdownEditCard();
}

/**
 * 
 * @param {this} el element
 * @param {number} assignUserID index of contact
 * @param {number} taskID index of card
 */
function updateCheckbox(el, assignUserID, taskID) {
    let checkboxEdit = document.getElementById(`assignCheckBox-${assignUserID}-${taskID}`);
    selectAssignContact(assignUserID, taskID);
    updateAssignedToArray(el, taskID);
    updateAssignedNumber(checkboxEdit, taskID);
    updateAssignedinTasks(el, taskID);   
}

/**
 * update total of assigned users
 * @param {element} checkboxEdit Radio Buttons
 * @param {index} taskID position of card in JSON
 */
function updateAssignedNumber(checkboxEdit, taskID) {
    let newText = checkboxEdit.closest('.assign-content').querySelector('.new-text');
    let assignedUserTotal = taskArray[taskID]['assigned_to'].length;

    if(assignedUserTotal > 0) {
        newText.innerHTML = `Assigned to ${assignedUserTotal} people`;
    } else {
        newText.innerHTML = 'Select contacts to assign';
    }
}

/**
 * update taskArray - assigned to array
 * @param {this} el element
 * @param {number} taskID index of card
 */
function updateAssignedToArray(el, taskID) {
    let assignCheckBoxSelected = el.closest('.checkbox-container').querySelectorAll('.assignCheckBox-selected');

    taskArray[taskID]['assigned_to'] = [];

    for (let j = 0; j < assignCheckBoxSelected.length; j++) {
        let checkBoxIDName = assignCheckBoxSelected[j].closest('.assign-checkbox').id;
        let userID = getUserIDFromCheckBoxIDName(checkBoxIDName);
        let userIDNum = parseInt(userID);

        taskArray[taskID]['assigned_to'].push(userIDNum); 
    }
}

/**
 * update show people in circlres in task, taskpopup and editcard
 * @param {this} el 
 * @param {number} taskID 
 */
function updateAssignedinTasks(el, taskID) {
    let updateAssignedPeopleEdit = generateAssignedPeopleEditTask(taskArray[taskID]['assigned_to']);
    let assignedPeopleEdit = el.closest('.editOverlay').querySelector('.assigned-people-edit');
    assignedPeopleEdit.innerHTML = updateAssignedPeopleEdit;
    
    let updateAssignedPeoplePopUp = generateAssignedPeoplePopUpTask(taskArray[taskID]['assigned_to']);
    let assignedPeoplePopUp = el.closest('.popUpCardBackground').querySelector('.assigned-people');
    assignedPeoplePopUp.innerHTML = updateAssignedPeoplePopUp;
    
    let updateAssignedPeopleTask = generateAssignedPeopleTask(taskArray[taskID]['assigned_to']);
    let assignedPeopleTask = el.closest('.card-inkl-popups').querySelector('.people');
    assignedPeopleTask.innerHTML = updateAssignedPeopleTask;
}

/**
 * to find the first number from the id in a string with regex
 * @param {number} CheckBoxIDName 
 * @returns first number of id
 */
function getUserIDFromCheckBoxIDName(CheckBoxIDName) {
    let regex = /assignCheckBox-(\d+)-(\d+)/g;
    return [...CheckBoxIDName.matchAll(regex)][0][1];
}

/**
 * show input to write mail to add a contact in dropbox
 * @param {this} el element
 */
function inviteNewContact(el) {
    el.closest('.assign-container').querySelector('.assign-content').classList.add('d-none');
    el.closest('.assign-container').querySelector('.add_task-input').classList.remove('d-none');
}

/**
 * send email by clicking enter
 * @param {event} event 
 */
function inviteNewContactEnter(event) {
    if (event.key === 'Enter') {
        sendInviteMail(event.target);
    }
}

/**
 * check is mail valid or not
 * @param {this} el 
 */
function sendInviteMail(el) {
    let email = el.closest('.add_task-input').querySelector('.contact-mail-edit').value.toLowerCase();
    let error = el.closest('.assign-container').querySelector('.error-invite-mail');
    let verification = validateEmail(email);
    
    if (Boolean(verification) == true) {
        sendInviteMailSuccessfully(el, email);
    } else {
        el.closest('.assign-container').querySelector('.error-invite-mail').classList.add('error-container');
        error.innerHTML = 'Email is invalid';
    }
}

/**
 * check email is already existing, if not push in usersArray, if yes assigning to this contact
 * @param {this} el 
 * @param {string} email 
 */
async function sendInviteMailSuccessfully(el, email) {
    let assignedUserID = searchIndexInArrayEmail(email, usersArray);
    let cardTitle = el.closest('.popup-card-content').querySelector('.input-edit-overlay').value;
    let taskID = getPositionByKeyInArray(taskArray, 'title', cardTitle);
    
    // if exist user in usersArray, then push in taskArray
    if (assignedUserID >= 0) { 
        taskArray[taskID]['assigned_to'].push(assignedUserID);   
    // if no exist user in usersArray, create a new user
    } else if (assignedUserID < 0) {
        usersArray.push({
            firstname: email,
            lastname: '',
            email: email, 
            initials: '@',
            color: 'HSL(199, 18%, 33%)'
        });
          
        let newAssignedUserID = searchIndexInArrayEmail(email, usersArray);
        taskArray[taskID]['assigned_to'].push(newAssignedUserID);
        await addToDBUsers();
    }
    updateAssignedinTasks(el, taskID);
    clearInviteMailContact(el);
    assignDropdownEditCard();
}

/**
 * by confirming of mail open the dropbox
 * @param {this} el element
 */
function clearInviteMailContact(el) {
    el.closest('.add_task-input ').querySelector('.contact-mail-edit').value = '';
    el.closest('.assign-container').querySelector('.error-invite-mail').innerHTML = '';
    el.closest('.assign-container').querySelector('.error-invite-mail').classList.remove('error-container');
    el.closest('.assign-container').querySelector('.assign-content').classList.remove('d-none');
    el.closest('.assign-container').querySelector('.add_task-input').classList.add('d-none');
}

/**
 * show all subtasks in cards
 */
function subTaskEditCard() {
    let subtaskContent = document.querySelectorAll('.subtask-content');

    for (let j = 0; j < subtaskContent.length; j++) {
        subtaskContent[j].innerHTML = '';
       
        let taskTitle = subtaskContent[j].closest('.popup-card-content').querySelector('input.input-edit-overlay').value;
        let taskID = getPositionByKeyInArray(taskArray, 'title', taskTitle);
        let subTasks = taskArray[taskID]['subtask'];
       
        for (let i = 0; i < subTasks.length; i++) {
            let subTaskName = subTasks[i]['name'];
            let subTaskDone = subTasks[i]['complete'];
    
            subtaskContent[j].innerHTML += generateSubTask(subTaskName, subTaskDone, taskID, i);
        }  
    }     
}

/**
 * generate HTML in Editcard
 * @param {string} subTaskName 
 * @param {boolean} subTaskDone 
 * @param {number} taskID 
 * @param {number} i 
 * @returns HTML
 */
function generateSubTask(subTaskName, subTaskDone, taskID, i) {
    return /*html*/`
        <div class="subtask-element">
            <div class="subtask-name">
                <div id="subtaskCheckbox-${i}-${taskID}" class="subtask-checkbox" onclick="updateSubTaskCheckbox(this, ${i}, ${taskID})">
                    ${isSubtaskDone(subTaskDone)}
                </div>
                <span class="subtask-name">${subTaskName}</span>
            </div>
            <div onclick="deleteSubTask(this, ${taskID}, ${i})" class="subtask-delete">✗</div>
        </div>`;
}

/**
 * show subtasks already selected
 * @param {boolean} subTaskDone 
 * @returns 
 */
function isSubtaskDone(subTaskDone) {
    if (subTaskDone == true) {
        return /*html*/`
            <div class="subtask-checkbox-selected">
                <img src="assets/img/checkmark.png">
            </div>`;  
    } else {
        return '';
    }
}

/**
 * update show subtasks in taskarray, taskcard and editcard
 * @param {this} el 
 * @param {number} i 
 * @param {number} taskID 
 */
function updateSubTaskCheckbox(el, i, taskID) {
    let subTaskCheckbox = document.getElementById(`subtaskCheckbox-${i}-${taskID}`);
    selectSubtaskCheckbox(i, taskID);
    updateSubtaskNumber(el, subTaskCheckbox, taskID);
    updateSubtaskinTasks(el, taskID);
}

/**
 * select subtasks and save change in Array and database
 * @param {number} i which checkbox
 * @param {number} taskID which taskcard
 */
function selectSubtaskCheckbox(i, taskID) {
    let subTaskCheckbox = document.getElementById(`subtaskCheckbox-${i}-${taskID}`);

    if (subTaskCheckbox.innerHTML.replace(/\s/g, '').length > 0) {
        subTaskCheckbox.innerHTML = ''; 
        taskArray[taskID]['subtask'][i]['complete'] = false;
    } else {
        subTaskCheckbox.innerHTML = /*html*/`
            <div class="subtask-checkbox-selected">
                <img src="assets/img/checkmark.png">
            </div>`; 
        taskArray[taskID]['subtask'][i]['complete'] = true;
    }
} 

/**
 * update the number of selected subtask in editcard
 * @param {this} el 
 * @param {element} subTaskCheckbox 
 * @param {number} taskID 
 */
function updateSubtaskNumber(el, subTaskCheckbox, taskID) {
    let subtaskCheckBoxSelected;
    let newText;
    let newWidth;

    if (el.classList.contains('subtask-container')) {
        subtaskCheckBoxSelected = el.querySelectorAll('.subtask-checkbox-selected');
        newText = el.querySelector('.process-text');
        newWidth = el.querySelector('.bar');
    } else {
        subtaskCheckBoxSelected = el.closest('.subtask-content').querySelectorAll('.subtask-checkbox-selected');
        newText = subTaskCheckbox.closest('.subtask-container').querySelector('.process-text');
        newWidth = subTaskCheckbox.closest('.subtask-container').querySelector('.bar');
    }

    let subtaskTotal = taskArray[taskID]['subtask'].length;
    let newPercent = subtaskCheckBoxSelected.length/subtaskTotal * 100;
    newText.innerHTML = `${subtaskCheckBoxSelected.length}/${subtaskTotal} Done`;
    newWidth.style = `width:${newPercent}%`; 
} 

/**
 * update the number of selected subtask in taskcard
 * @param {this} el 
 * @param {number} taskID 
 */
function updateSubtaskinTasks(el, taskID) {
    let subtaskCheckBoxSelected;

    if (el.classList.contains('subtask-container')) {
        subtaskCheckBoxSelected = el.querySelectorAll('.subtask-checkbox-selected');
    } else {
        subtaskCheckBoxSelected = el.closest('.subtask-content').querySelectorAll('.subtask-checkbox-selected');
    }
    
    let newText = el.closest('.card-inkl-popups').querySelector('.process-text');
    let newWidth = el.closest('.card-inkl-popups').querySelector('.bar');
    let subtaskTotal = taskArray[taskID]['subtask'].length;
    let newPercent = subtaskCheckBoxSelected.length/subtaskTotal * 100;
    newText.innerHTML = `${subtaskCheckBoxSelected.length}/${subtaskTotal} Done`;
    newWidth.style = `width:${newPercent}%`;
}

/**
 * delete subtask in editcard
 * @param {this} el 
 * @param {number} taskID 
 * @param {number} i 
 */
function deleteSubTask(el, taskID, i) {
    taskArray[taskID]['subtask'].splice(i, 1); 
    
    el = el.closest('.subtask-container');

    subTaskEditCard();
    updateSubtaskinTasks(el ,taskID);
    updateSubtaskNumber(el, null, taskID);
}

/**
 * edited description, due date and prio in task and save in DB
 * @param {this} el element
 * @param {number} prio 
 */
async function saveEditTask(el, prio) {
    let taskTitle = el.closest('.popup-card-content').querySelector('input.input-edit-overlay').value;
    let taskID = getPositionByKeyInArray(taskArray, 'title', taskTitle);

    // change description
    let newDescription = el.closest('.editOverlay').querySelector('.textarea-edit-overlay').value;
    el.closest('.popUpCardBackground').querySelector('.notice-overlay').innerHTML = newDescription;
    el.closest('.card-inkl-popups').querySelector('.card-notice').innerHTML = requestDescriptionLength(newDescription);
   
    // change due date
    let newDueDate = el.closest('.editOverlay').querySelector('.due-date').value;
    el.closest('.popUpCardBackground').querySelector('.current-date-overlay').innerHTML = newDueDate;

    if (prio) {
        // change prio in popUp
        let requestPrioOverlayHTML = requestPrioOverlay(prio);
        let prioOverlayElement = el.closest('.popUpCardBackground').querySelector('.prio-overlay');
        prioOverlayElement.outerHTML = requestPrioOverlayHTML;

        // change prio in task
        let requestPrioTaskURL = requestPrioNumber(prio);
        let prioTaskElement = el.closest('.card-inkl-popups').querySelector('.priority');
        prioTaskElement.src = requestPrioTaskURL;
    }

    // update local database
    if (prio) {
        taskArray[taskID]['prio'] = prio;
    }
    taskArray[taskID]['due_date'] = newDueDate;
    taskArray[taskID]['description'] = newDescription;

    // update backend database
    await addToDBTask();
}