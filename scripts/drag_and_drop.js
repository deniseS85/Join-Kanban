let cardTitleDrag;

/**
 * allow to drop in other container
 * @param {event} event 
 */
function allowDrop(event) {
    event.preventDefault();
}


/**
 * drag card is not visible. Show drag-highlight
 * cardTitleDrag = find the title of dragging card to using like a ID
 * @param {event} ev 
 */
function drag(ev) {
    currentDraggedElement = ev.target; 
    ev.target.style.opacity = "0.01";
    cardTitleDrag =  ev.target.querySelector('.card .card-text .card-title').innerText;
    addGhostCard();
}


/**
 * Drag-Element will be add on the last.
 * Drag-Highlight-Element is deleted and created at the end of the cardcontainer to perform the dragee property without error
 * @param {event} ev 
 */
function drop(ev) { 
    ev.target.closest('.cardContainer').appendChild(currentDraggedElement);
    let targetID;
    
    if (ev.target.classList.contains('cardContainer')) {
        targetID = ev.target.id;
        ev.target.closest('.cardContainer').querySelector('.drag-highlight').remove();
        ev.target.closest('.cardContainer').querySelector('.drag-highlight-helper').remove();
        createGhostCard(targetID);
    } else {
        targetID = ev.target.closest('.cardContainer').id;
        ev.target.closest('.cardContainer').querySelector('.drag-highlight-helper').remove();
        ev.target.closest('.cardContainer').querySelector('.drag-highlight').remove();
        createGhostCard(targetID);
    }
    let newStatus = currentDraggedElement.closest('.cardContainer').id;
    card_sound.play();
    sendNewStatusTaskToDB(newStatus);
}

/**
 * drag card visible at drag. remove drag-highlight 
 * @param {event} ev 
 */
function dragend(ev) {
    ev.target.style.opacity = "1";
    deleteGhostCard();
}


/**
 * create drag-highlight and show at the end of the cards in respective cardContainer
 * @param {string} id 
 */
function createGhostCard(id) {
    let dragCardHelper = document.createElement('div');
    dragCardHelper.classList.add('drag-highlight-helper');
    dragCardHelper.classList.add('d-none');
    document.getElementById(id).appendChild(dragCardHelper);

    let dragCard = document.createElement('div');
    dragCard.classList.add('drag-highlight');
    dragCard.classList.add('d-none');
    document.getElementById(id).appendChild(dragCard);
}


/**
 * create helper div to determine the position of drag-highlight
 * this function is working like "position: sticky"
 * @param {event} ev 
 */
function autoScrollDragHighlight(ev) {
    let header = document.querySelector('#header');
    let contentFixBoard = document.querySelector('#content .content-fix-board');
    let headerHeight = header.offsetHeight; // Height from header
    let contentFixBoardHeight = contentFixBoard.offsetHeight; // Height of contentFixBoard
    let headerFullHeight = headerHeight + contentFixBoardHeight; // Add both heights
    let dragHighlightHelperElements = document.querySelectorAll('#cards .drag-highlight-helper');
    
    
    for (let i = 0; i < dragHighlightHelperElements.length; i++) {
        let dragHighlightHelper = dragHighlightHelperElements[i];
        let dragHighlight = dragHighlightHelper.parentElement.querySelector(".drag-highlight");
        let dragHighlightHelperRect = dragHighlightHelper.getBoundingClientRect(); // Determine position and size of dragHighlightHelper
        
        // Check if dragHighlightHelper is still in the visible area after scrolling
        if ((dragHighlightHelperRect.top - headerFullHeight) > 0) {
            // If yes, then do nothing
            dragHighlight.style.position = null;
            dragHighlight.style.top = null;
        } else {
            // If not, make sure that dragHighlight scrolls so that you can move TaskCard to other columns.
            dragHighlight.style.position = "absolute";
            dragHighlight.style.top = (window.scrollY+headerFullHeight) + "px";
        }
    } 
}

document.addEventListener("scroll", autoScrollDragHighlight);


/**
 * remove drag-highlight by dragend
 */
function deleteGhostCard() {
    let ghostCard = document.getElementsByClassName('drag-highlight');

    for (let i = 0; i < ghostCard.length; i++) {
       ghostCard[i].classList.add('d-none');
    }
}


/**
 * add drag-highlight only in targetContainer by ondragstart
 */
function addGhostCard() {
    let ghostCard = document.getElementsByClassName('drag-highlight');

    for (let i = 0; i < ghostCard.length; i++) {
        let startContainer = ghostCard[i].closest('.cardContainer').id;
        let targetContainer = currentDraggedElement.closest('.cardContainer').id;

        if (startContainer != targetContainer) {
            ghostCard[i].classList.remove('d-none');
        } 
    }
}


/**
 * open DragMenu to move cards
 * @param {this} el 
 */
function openDragMenu(el) {
    let dragMenu =  el.closest('.card-inkl-popups').querySelectorAll('.drag-menu');

    for (let i = 0; i < dragMenu.length; i++) {
        if (dragMenu[i].style.display === "none") {
            closeAllDragMenu();
            dragMenu[i].style.display = "flex";
        }   else {
            dragMenu[i].style.display = "none"; 
        }
    }
    isSameStatus(el); 
}


/**
 * if same status, the status is not clickable
 * @param {this} el 
 */
function isSameStatus(el) {
    let status = el.closest('.process-section').querySelectorAll('.status-responsiv');
    let currentStatus = el.closest('.process-section').querySelector('.process-item-responsiv div');
   
    for (let i = 0; i < status.length; i++) {
        if(currentStatus.innerHTML == status[i].innerHTML) {
            status[i].style.opacity = '0.3';
            status[i].style.pointerEvents = 'none';
        }  
    }
}


/**
 * close all Drag Menus
 */
function closeAllDragMenu() {
    let dragMenu =  document.querySelectorAll('.drag-menu');

    for (let i = 0; i < dragMenu.length; i++) {
        dragMenu[i].style.display = 'none'; 
    }  
}


/**
 * move tasks by onclick in device modus
 * @param {this} el 
 * @param {string} status 
 */
function moveTo(el, status) {
    let taskCard = el.closest('.cardContainer').querySelector('.card-inkl-popups');
   
    cardTitleDrag = el.closest('.card-inkl-popups').querySelector('.card-title').innerHTML;
    el.closest('.cardContainer').appendChild(taskCard);
    
    card_sound.play();
    closeAllDragMenu();
    sendNewStatusTaskToDB(status);
    updateHTML();
}


/**
 * change status of the dragged card and add to databse
 * @param {string} newStatus
 */
async function sendNewStatusTaskToDB(newStatus) {
    let findIndex = findByKey('title', cardTitleDrag);
    let index = taskArray.findIndex(findIndex);
    taskArray[index]['status'] = newStatus;
    await addToDBTask();
}