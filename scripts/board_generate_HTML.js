function generateTasks(category, element, subTask, subTaskDone, percent, prioImg, date, prioOverlay, prio, assignedTo) {
    let assignedPeopleHTML = generateAssignedPeopleTask(assignedTo);
    let trimText = element['description'];
    
    return /*html*/ `
    <div class="card-inkl-popups" draggable="true" ondragstart="drag(event)" ondragend="dragend(event)">
        <div class="card" onclick="openPopUp(this)">
            <div class="drag-menu" style="display:none" onclick="doNotCloseOverlay(event)">
                <div class="drag-menu-title">Move To:</div>
                <div onclick="moveTo(this,'ToDo')" class="status-responsiv">ToDo</div>
                <div onclick="moveTo(this,'progress')" class="status-responsiv">In progress</div>
                <div onclick="moveTo(this,'await')" class="status-responsiv">Awaiting Feedback</div>
                <div onclick="moveTo(this,'done')" class="status-responsiv">Done</div>
            </div>
            <div class="card-header">
                <div class="card-title-border" style="background:${categoryArray[category-1]['color']}">
                    <div class="category">${categoryArray[category-1]['name']}</div>
                </div>
                <img onclick="openDragMenu(this); doNotCloseOverlay(event)" class="drag-icon" src="assets/img/drag-and-drop-responsiv.png">
            </div>
            <div class="card-text">
                <div class="card-title">${element['title']}</div>
                <div class="card-notice">${requestDescriptionLength(trimText)}</div>
            </div>
            <div class="process-status" ${isSubTask(subTaskDone, subTask)}>
                <div class="process-bar">
                    <div class="bar" style="width:${percent}%"></div>
                </div>
                <div class="process-text">${subTaskDone.length}/${subTask.length} Done</div>
            </div>
            <div class="assignedPeople">
                <div class="people">${assignedPeopleHTML}</div>
                <img src="${prioImg}" class="priority">
            </div>
        </div>
        ${generateTaskPopup(category, element, subTask, subTaskDone, percent, date, prioOverlay, prio, assignedTo)}`;     
}


function generateTaskPopup(category, element, subTask, subTaskDone,percent, date, prioOverlay, prio, assignedTo) {
    let assignedPeopleNameHTML = generateAssignedPeoplePopUpTask(assignedTo);

    return /*html*/`
        <div onclick="closePopUp(this); closeAssignedDropBox(this)" class="popUpCardBackground" style="display:none">
            <div class="popup-card-content" onclick="doNotCloseOverlay(event)">
                <div class="header-overlay">
                    <div class="card-title-overlay" style="background:${categoryArray[category-1]['color']}">
                        <div class="category-overlay">${categoryArray[category-1]['name']}</div>
                    </div>
                    <img onclick="closePopUp(this)" src="assets/img/close.png">
                </div>
                <div class="card-text-overlay">
                    <div class="title-overlay">${element['title']}</div>
                    <div class="notice-overlay">${element['description']}</div>
                </div>
                <div class="section-overlay">
                    <div class="text-overlay">Due date:</div>
                    <div class="current-date-overlay">${date}</div>
                </div>
                <div class="section-overlay">
                    <div class="text-overlay">Priority:</div>
                    ${prioOverlay}
                </div>
                <div class="text-overlay assigned-overlay">Assigned To:
                    <div class="assigned-people">${assignedPeopleNameHTML}</div>
                </div>
                <div class="footer-overlay">
                    <img onclick="confirmDelete(this)" class="delete-img"src="assets/img/delete.png">
                    <img onclick="openEditPopUp(this)" src="assets/img/edit-button.png">
                </div>
                <div class="delete-box"  style="display:none"></div> 
            </div>
            ${generateEditPopUp(element, subTask, subTaskDone, percent, date, prio, assignedTo)}`;
}


function generateEditPopUp(element, subTask, subTaskDone, percent, date, prio, assignedTo) {
    let assignedPeopleHTML = generateAssignedPeopleEditTask(assignedTo);

    return /*html*/ `
            <div class="popup-card-content editOverlay" style="display:none" onclick="doNotCloseOverlay(event);  closeAssignedDropBox(this)">
                <div class="header-overlay">
                    <div class="first-title-edit-overlay">Title</div>
                    <img class="arrow-back" onclick="closePopUp(this); closeAssignedDropBox(this)" src=assets/img/close.png>
                    <img class="arrow-responsiv" onclick="openPopUp(this)" src="assets/img/arrow-right.png">
                </div>
                <input class="input-edit-overlay" value="${element['title']}" disabled="disabled">
                <div class="title-edit-overlay">Description</div>
                <textarea class="textarea-edit-overlay">${element['description']}</textarea>
                <div class="due-date-edit-overlay">
                    <div class="title-edit-overlay">Due date</div>
                    <input class="due-date" type="date" value="${date}" min="${currentDate}">
                </div>
                <div class="title-edit-overlay">Prio</div>
                <div class="prio-edit-overlay">
                    <div onclick="requestPrioEditOverlay(this, 1)" class="prio-element edit-urgent ${isCurrentPrio(prio, 1)}" style="">Urgent<img class="edit-urgent-img" src="assets/img/arrow-top_orange.png"></div>
                    <div onclick="requestPrioEditOverlay(this, 2)" class="prio-element edit-medium ${isCurrentPrio(prio, 2)}" style="">Medium<img class="edit-medium-img" src="assets/img/equal_orange.png"></div>
                    <div onclick="requestPrioEditOverlay(this, 3)" class="prio-element edit-low ${isCurrentPrio(prio, 3)}" style="">Low<img class="edit-low-img" src="assets/img/arrow-down_green.png"></div>
                </div>

                <div class="assign-container">
                    <div class="title-edit-overlay">Assigned to</div>
                    <div class="assign-content"> 
                        <div class="selectBox" onclick="openAssignedDropBox(this); doNotCloseOverlay(event)"> 
                            <div class="dropdown-select">
                                <span class="new-text">Select contacts to assign</span>
                                <img src="assets/img/arrow-down.png">
                            </div>
                            <!-- <div class="overSelect"></div> -->
                        </div>
                        <div class="checkbox dropdown-collapse" onclick="doNotCloseOverlay(event)">
                            <div class="checkbox-container"></div>

                            <div class="assigned_to-element checkboxes-element add-contact" onclick="inviteNewContact(this)">
                                Invite new Contact
                                <img src="assets/img/contact.png">
                            </div>
                        </div>
                    </div>

                    <div class="add_task-input d-none">
                        <input class="contact-mail-edit" type="email" placeholder="Contact email" onkeypress="inviteNewContactEnter(event)">
                        <button type="button" onclick="clearInviteMailContact(this)">
                            <img src="assets/img/x-mark.png">
                        </button>
                        <span style="color: #d1d1d1">|</span>
                        <button onclick="sendInviteMail(this)" type="button">
                            <img src="assets/img/checkmark.png">
                        </button>
                    </div>             
                    <div class="error-invite-mail" style="padding: 0;"></div>
                </div>
                <div class="assigned-people-edit">${assignedPeopleHTML}</div>

                <div class="subtask-container">
                    <div class="subtask-title-edit-overlay">Subtasks</div>
                    <div class="process-status" ${isSubTask(subTaskDone, subTask)}>
                        <div class="process-bar">
                            <div class="bar" style="width:${percent}%"></div>
                        </div>
                        <div class="process-text">${subTaskDone.length}/${subTask.length} Done</div>
                    </div>
                    <div class="subtask-content"></div>
                </div>

                <div class="footer-overlay-edit">
                    <button onclick="openPopUp(this); saveEditTask(this, null); closeAssignedDropBox(this)" class="button-overlay">OK
                        <img src="assets/img/done.png">
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}


function generateAssignedPeopleEditTask(assignedTo) {
    let assignedPeopleHTML = '';
    for (let i = 0; i < assignedTo.length; i++) {
        assignedPeopleHTML += /*html*/`
            <div class="one-edit" style="background:${usersArray[assignedTo[i]]['color']}">${usersArray[assignedTo[i]]['initials']}</div>`;  
    }
    return assignedPeopleHTML;
}


function generateAssignedPeoplePopUpTask(assignedTo) {
    let assignedPeopleNameHTML = '';

    for (let i = 0; i < assignedTo.length; i++) {
        assignedPeopleNameHTML += /*html*/`
        <div class="assigned-people-name">
            <div class="one" style="background:${usersArray[assignedTo[i]]['color']}">${usersArray[assignedTo[i]]['initials']}</div>
            <div class="people-name">${usersArray[assignedTo[i]]['firstname']} ${usersArray[assignedTo[i]]['lastname']}</div>
        </div>`;  
    }
    return assignedPeopleNameHTML
}


function generateAssignedPeopleTask(assignedTo) {
    let assignedPeopleHTML = '';

    for (let i = 0; i < assignedTo.length; i++) {
        if (i < 2 || assignedTo.length == 3) {
            assignedPeopleHTML += /*html*/`
            <div class="one" style="background:${usersArray[assignedTo[i]]['color']}">${usersArray[assignedTo[i]]['initials']}</div>`; 
        } 
        if (i == 2 && assignedTo.length > 3) {
            assignedPeopleHTML += /*html*/`
            <div class="one" style="background:var(--peopleBlack)">+${assignedTo.length-2}</div>`; 
        }
    }
    return assignedPeopleHTML;
}

