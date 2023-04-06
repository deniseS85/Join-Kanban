
/**
 * request the number of prio and get this image (1=urgent, 2=medium, 3=low)
 * @param {number} prio value of "prio" 1,2 or 3
 * @returns images depending of the value
 */
function requestPrioNumber(prio) {
    if (prio == 1) {
        return `assets/img/urgent.png`;
    } else if (prio == 2) {
        return `assets/img/medium.png`;
    } else if (prio == 3) {
        return `assets/img/low.png`;
    }
}


/**
 * show this prio, what is selected in overlay card
 * @param {number} prio 
 * @returns images depend, which prio is selected
 */
function requestPrioOverlay(prio) {
    if (prio == 1) {
        return `<div class="prio-overlay edit-urgent selected">Urgent<img class="edit-urgent-img" src="assets/img/arrow-urgent-white.png"></div>`;
    } else if (prio == 2) {
        return `<div class="prio-overlay edit-medium selected">Medium<img class="edit-medium-img" src="assets/img/arrow-medium-white.png"></div>`;
    } else if (prio == 3) {
        return `<div class="prio-overlay edit-low selected">Low<img class="edit-low-img" src="assets/img/arrow-low-white.png"></div>`;
    } 
}


/**
 * compare which prio is selected
 * @param {number} currentPrio 
 * @param {number} staticPrio 
 * @returns class 'selected' or empty string
 */
function isCurrentPrio(currentPrio, staticPrio) {
    if (currentPrio == staticPrio) {
        return 'selected';
    } else {
        return "";
    }
}


/**
 * select prio and change selection of this element, if other prio is selected
 * @param {this} el 
 * @param {number} prio 
 */
function requestPrioEditOverlay(el, prio) {
    // deselect all prio elements
    el.closest('.prio-edit-overlay').querySelector('.edit-urgent').classList.remove("selected");
    el.closest('.prio-edit-overlay').querySelector('.edit-medium').classList.remove("selected");
    el.closest('.prio-edit-overlay').querySelector('.edit-low').classList.remove("selected");

    // select only current prio element
    if (prio == 1) {
        el.closest('.prio-edit-overlay').querySelector('.edit-urgent').classList.add("selected");
    } else if (prio == 2) {
        el.closest('.prio-edit-overlay').querySelector('.edit-medium').classList.add("selected");
    } else if (prio == 3) {
        el.closest('.prio-edit-overlay').querySelector('.edit-low').classList.add("selected");
    }
    saveEditTask(el, prio);
}


/**
 * request, if array is empty or not for calculation without 0
 * @param {Array} subTaskDone all subtask is true
 * @param {Array} subTask all subtask (true and false)
 * @returns 0, if array is empty
 * @returns result for show the width of statusbar
 */
function isZero(subTaskDone, subTask) {
    if (subTaskDone == 0 && subTask == 0) {
        return 0;
    } else {
        return (subTaskDone.length/subTask.length) * 100;
    }
}


/**
 * show subtask-bar only, if existing
 * @param {Array} subTaskDone
 * @param {Array} subTask 
 * @returns 
 */
function isSubTask(subTaskDone, subTask) {
    if (subTaskDone.length == 0 && subTask.length == 0) {
        return `style="visibility:hidden"`;
    } else {
        return '';
    }
}


/**
 * check is text longer then 38 characters
 * @param {string} trimText 
 * @returns full text or cut text
 */
function requestDescriptionLength(trimText) {
    if (trimText.length < 38) {
        return trimText;
    }   else {
            return trimText = trimText.substring(0, 37) + /*html*/`
                <span class="dots">...</span>
                <span class="more">${trimText.substring(37, trimText.length)}</span>`;
    }
}


function isAddTaskOpen() {
    let taskOverlay = document.getElementById('task-overlay');
    let header = document.getElementsByTagName('header');
    
    if (taskOverlay.style.display == 'flex') {
        header.style.display = 'none';
    }
}