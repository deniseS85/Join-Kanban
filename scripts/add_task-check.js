/**
 * check if Title exist
 * @returns - input of Title Input box
 */
function checkTitle() {
    let input = document.getElementById('new_task-title');
    let error = document.getElementById('error-title');

    if(input.value.length < 1) {
        error.innerHTML = 'This field is required';
    } else {
        error.innerHTML = '';
        return input.value;
    }
}


/**
 * searched element in array['title']
 * @param {string} searchTerm - searched element in array
 * @param {array} array - array to searching element
 * @returns 
 */
function searchIndexInArrayTasks(searchTerm, array) {
    var index = array.findIndex(function(item, i){
      return item.title.toLowerCase() === searchTerm.toLowerCase()
    });
    
    return index; //Output Index or -1
}


/**
 * check if Description exist
 * @returns - input of Description Input box
 */
function checkDescription() {
    let input = document.getElementById('new_task-description');
    let error = document.getElementById('error-description');

    if(input.value.length < 1) {
        error.innerHTML = 'This field is required';
    } else {
        error.innerHTML = '';
        return input.value;
    }
}


/**
 * searched element in array['name']
 * @param {string} searchTerm - searched element in array
 * @param {array} array - array to searching element
 * @returns - Index or -1
 */
function searchNameIndexInArray(searchTerm, array) {
    try {
        var index = array.findIndex(function(item, i){
        return item.name.toLowerCase() === searchTerm.toLowerCase() // CaseSensitiv raus
        });
    } catch {}
    
    return index;
}


/**
 * check if Category selected
 * @returns Index (CategoryArray) of selected Category
 */
async function checkCategory() {
    let categoryIndex = await newCategoryPush();

    if(categoryIndex >= 0) {
        document.getElementById('error-new_category').innerHTML = '';
        return categoryIndex;
    } else {
        document.getElementById('error-new_category').innerHTML = 'This field is required';
    }
}


/**
 * find Index of 'array' over email
 * @param {string} searchTerm - email of searched Contact
 * @param {array} array - searching in array 'array'
 * @returns - found index
 */
function searchIndexInArrayEmail(searchTerm, array) {
    var index = array.findIndex(function(item, i){
      return item.email === searchTerm
    });
    
    return index;
}


/**
 * find Index of 'array' over email
 * @param {string} searchTerm - email of searched Contact
 * @param {array} array - searching in array 'array'
 * @returns - found index
 */
function searchIndexInArray(searchTerm, array) {
    var index = array.findIndex(function(item, i){
      return item === searchTerm
    });
    
    return index;
}


/**
 * validate Email syntax (name@domain.topLvlDomain)
 * @param {string} email 
 * @returns - boolean
 */
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


/**
 * return Date if ok else display error
 * @returns date
 */
function getDueDate() {
    let date = document.getElementById('due-date').value;
    let error = document.getElementById('error-due_date');

    if(date){
        if(date < new Date().toISOString().split("T")[0]) {
            error.innerHTML = 'Due date cannot be in the past';
        } else {
            error.innerHTML = '';
            return date;
        }
    } else {
        error.innerHTML = '<span>This field is required</span>';
    }
}


/**
 * compare selected Prio with selected Prio before
 * @param {number} nr 
 * @returns - Boolean: new (false) or same (true)
 */
function compareWithOldSelection(nr) {
    let comparePrio;

    switch (nr) {
        case 1:
            comparePrio = 'Urgent';
            break;
        case 2:
            comparePrio = 'Medium';
            break;
        case 3:
            comparePrio = 'Low'
            break;
    }

    try {
        return document.getElementsByClassName('prio-selected')[0].innerHTML.startsWith(comparePrio);
    } catch {}
}


/**
 * check if Title exist
 * @returns - input of Title Input box
 */
function checkPrio() {
    let error = document.getElementById('error-prio');

    if(prio) {
        error.innerHTML = '';
    } else {
        error.innerHTML = 'This field is required';
    }
}


/**
 * add/remove tick mark to substrings checkbox
 * @param {number} i - index of substrings
 */
function checkCheckboxValue(i) {
    let subtask = document.getElementById(`subtask-checkbox-${i}`);
    
    if(Boolean(subtasks[i]['complete']) == true) {
        subtask.innerHTML = `
        <div class="subtask-checkbox-selected"><img src="./assets/img/checkmark.png" alt="check mark"></div>`;
    }else {
        subtask.innerHTML = '';
    }
}


/**
 * Check if 
 * @returns status string, e.g. 'ToDo'
 */
function checkStatus() {
    let status;
    try {
        status = currentStatus;
    } catch (e) {}
    
    if(status) {
        return status;
    } else {
        return 'ToDo'
    }
}


/**
 * check if Task already Assigned to Someone
 */
function checkAssignedToUser() {
    let alreadyAssignedTo;

    try {
         alreadyAssignedTo = taskForUser;
    } catch (error) {}

    if(alreadyAssignedTo) {
        assignToArray.push(alreadyAssignedTo);
    }
}