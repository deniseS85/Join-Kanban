let currentDraggedElement;
let currentDate;
let card_sound = new Audio('assets/sound/card-drop.mp3');
let delete_task = new Audio('assets/sound/delete-task.mp3');
let isOpenAssignedDropbox = false;
let currentStatus;


/**
 * onload function
 */
async function initBoard() {
    await includeHTML();
    setURL('https://denise.selfcoders.com/join_kanban/smallest_backend_ever');
    await loadFromDB();
    updateHTML();
    assignDropdownEditCard();
    subTaskEditCard();
    renderAssignDropdown();
    renderCategory(); 
}


/**
 * load all from database
 */
async function loadFromDB() {
    await downloadFromServer();
    usersArray = JSON.parse(backend.getItem('users')) || [];
    categoryArray = JSON.parse(backend.getItem('categories')) || [];
    taskArray = JSON.parse(backend.getItem('tasks')) || [];
}


/**
 * add categories to database
 */
async function addToDBCategory() {
    await backend.setItem('categories', JSON.stringify(categoryArray));
}


/**
 * add tasks to database
 */
async function addToDBTask() {
   await backend.setItem('tasks', JSON.stringify(taskArray));
}


/**
 * add contacts to database
 */
async function addToDBUsers() {
    await backend.setItem('users', JSON.stringify(usersArray));
}


/**
 * Update Drag and Drop Elements
 */
function updateHTML() {
    filterToDo();
    filterProgress();
    filterAwait();
    filterDone(); 
}


/**
 * All ToDo Elements are filtered with content
 */
function filterToDo() {
    let todos = taskArray.filter(t => t['status'] == 'ToDo');
    document.getElementById('ToDo').innerHTML = '';

    for (let i = 0; i < todos.length; i++) {
        let element = todos[i];
        let prio = element['prio'];
        let prioImg = requestPrioNumber(prio);
        let prioOverlay = requestPrioOverlay(prio);
        let subTask = element['subtask'];
        let subTaskDone = subTask.filter(s =>s['complete'] == true);
        let percent = isZero(subTaskDone, subTask);
        let category = element['category'];
        let date = element['due_date'];
        let assignedTo = element['assigned_to'];
        
        document.getElementById('ToDo').innerHTML += generateTasks(category, element, subTask, subTaskDone, percent, prioImg, date, prioOverlay, prio, assignedTo); 
    }
    createGhostCard('ToDo');
}


/**
 * All Progress Elements are filtered with content
 */
function filterProgress() {
    let progress = taskArray.filter(t => t['status'] == 'progress');
    document.getElementById('progress').innerHTML = '';

    for (let i = 0; i < progress.length; i++) {
        let element = progress[i];
        let prio = element['prio'];
        let prioImg = requestPrioNumber(prio);
        let prioOverlay = requestPrioOverlay(prio);
        let subTask = element['subtask'];
        let subTaskDone = subTask.filter(s =>s['complete'] == true);
        let percent = isZero(subTaskDone, subTask);
        let category = element['category'];
        let date = element['due_date'];
        let assignedTo = element['assigned_to'];
    
        document.getElementById('progress').innerHTML += generateTasks(category, element, subTask, subTaskDone, percent, prioImg, date, prioOverlay, prio, assignedTo);
    }  
    createGhostCard('progress');
}


/**
 * All Await Elements are filtered with content
 */
function filterAwait() {
    let wait = taskArray.filter(t => t['status'] == 'await');
    document.getElementById('await').innerHTML = '';

    for (let i = 0; i < wait.length; i++) {
        let element = wait[i];
        let prio = element['prio'];
        let prioImg = requestPrioNumber(prio);
        let prioOverlay = requestPrioOverlay(prio);
        let subTask = element['subtask'];
        let subTaskDone = subTask.filter(s =>s['complete'] == true);
        let percent = isZero(subTaskDone, subTask);
        let category = element['category'];
        let date = element['due_date'];
        let assignedTo = element['assigned_to'];
        
        document.getElementById('await').innerHTML += generateTasks(category, element, subTask, subTaskDone, percent, prioImg, date, prioOverlay, prio, assignedTo);
    }  
    createGhostCard('await');
}


/**
 * All Done Elements are filtered with content
 */
function filterDone() {
    let done = taskArray.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';

    for (let i = 0; i < done.length; i++) {
        let element = done[i];
        let prio = element['prio'];
        let prioImg = requestPrioNumber(prio);
        let prioOverlay = requestPrioOverlay(prio);
        let subTask = element['subtask'];
        let subTaskDone = subTask.filter(s =>s['complete'] == true);
        let percent = isZero(subTaskDone, subTask);
        let category = element['category'];
        let date = element['due_date'];
        let assignedTo = element['assigned_to'];
        
        document.getElementById('done').innerHTML += generateTasks(category, element, subTask, subTaskDone, percent, prioImg, date, prioOverlay, prio, assignedTo); 
    }
    createGhostCard('done');
}


/**
 * Help Function to find the index in array
 * @param {keyname} key 
 * @param {keyvalue} value 
 * @returns 
 */
function findByKey(key, value) {
    return (item, i) => item[key] === value;
}


/**
 * open taskcards
 * @param {this} el this element
 */
function openPopUp(el) {
    el.closest('.card-inkl-popups').setAttribute('draggable', false);
    el.closest('.card-inkl-popups').querySelector('.popUpCardBackground').style.display = 'flex';
    el.closest('.card-inkl-popups').querySelector('.popup-card-content').style.display = 'flex';
    el.closest('.card-inkl-popups').querySelector('.editOverlay').style.display = 'none';
    document.getElementById('body').style.overflowY = 'hidden';
}


/**
 * close taskcard
 * @param {this} el this element
 */
function closePopUp(el) {
    el.closest('.card-inkl-popups').querySelector('.popUpCardBackground').style.display = 'none';
    document.getElementById('body').style.overflowY = '';
    el.closest('.card-inkl-popups').setAttribute('draggable', true);
}


/**
 * open editcard
 * @param {this} el this element
 */
function openEditPopUp(el) {
    el.closest('.card-inkl-popups').querySelector('.popup-card-content').style.display = 'none';
    el.closest('.card-inkl-popups').querySelector('.editOverlay').style.display = 'flex';
}


/**
 * open addtask popup, open over cardcontainer sort new tasks in this column (status)
 * @param {string} id 
 */
function overlayAddTask(id) {
    currentStatus = id;
    document.getElementById('task-overlay').style.display = 'flex';
    document.getElementById('closeAddTask').style.display = 'flex';
    document.getElementById('header').classList.add('d-none');
    document.getElementById('body').style.overflowY = 'hidden';
}


/**
 * close addtask popup
 */
function closePopUpAddTask() {
    document.getElementById('task-overlay').style.display = 'none';
    document.getElementById('closeAddTask').style.display = 'none';
    document.getElementById('header').classList.remove('d-none');
    document.getElementById('body').style.overflowY = '';
}


/**
 * Inputvalues are filtered by letters. Only cards with this letters are displayed
 */
function filterInput() {
    let input = document.getElementById('input').value.toLowerCase();
    let content = document.getElementById('cards');
    let cards = content.querySelectorAll('.card');

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector('.card-title').innerHTML;
        let notice = cards[i].querySelector('.card-notice').innerHTML;

        if (title.toLowerCase().substring(0, input.length) == input || notice.toLowerCase().substring(0, input.length) == input) {
            cards[i].style.display = 'flex';
        } else {
            cards[i].style.display = 'none';
        }
    }
}


/**
 * click on x in input type search, show all cards
 */
function clearInput() {
    let cards = content.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'flex'; 
    }
}


/**
 * change image by hover
 * @param {this} element this is the image that is being changed
 */
function hover(element) {
    element.setAttribute('src', 'assets/img/addBlue.png');
}
  
function unhover(element) {
    element.setAttribute('src', 'assets/img/add-task-icon.png');
}


/**
 * prevent closing this window by onclick
 * @param {event} event 
 */
function doNotCloseOverlay(event) {
    event.stopPropagation();
}

function closeOverlay() {
    document.getElementById('popUpBg').style.display = 'none';
}


/**
 * get day, month, year and convert in format 2022 - 02 - 01
 */
function dateNow() {
    currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, '0');
    let mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    let yyyy = currentDate.getFullYear();
    currentDate = yyyy + '-' + mm + '-' + dd; 
}
dateNow();


/**
 * by click on delete icon, show confirm window to say yes or no
 * @param {this} el element
 */
function confirmDelete(el) {
    let deleteBox = el.closest('.popup-card-content').querySelector('.delete-box');
    deleteBox.style.display = 'flex';

    deleteBox.innerHTML = /*html*/ `
        <div id="popUpBg" class="confirm-delete-mail " onclick="closeOverlay()"> 
            <div onclick="doNotCloseOverlay(event)" class="delete-content">
                <div class="delete-text">
                    <div>Do you really want to delete this task?</div>
                    <div class="confirm-btn-delete">
                        <button onclick="deleteTask(event.target)">Yes</button>
                        <button onclick="closeOverlay()">No</button>  
                    </div>
                </div>
            </div>
        </div>`;
}


/**
 * delete task and save in DB
 * @param {this} el element
 */
async function deleteTask(el) {
    let taskTitle = el.closest('.cardContainer .popup-card-content').querySelector('.title-overlay').innerHTML;
    let taskID = getPositionByKeyInArray(taskArray, 'title', taskTitle);
    let taskToDelete = el.closest('.card-inkl-popups');
    delete_task.volume = 0.2;
    delete_task.play();
    taskToDelete.remove();
    taskArray.splice(taskID, 1);
    document.getElementById('body').style.overflowY = 'scroll';
    await addToDBTask();
}