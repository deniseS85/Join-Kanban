let isToolTipOpen = false;

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); 
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    /* New event is executed when the includeHTML is loaded. */
    document.dispatchEvent(AfterincludeHTMLFunctionEvent);
}


/**
 * open Tooltip 'Log Out' by Click on Image Profile
 */
function openTooltip(el) {
    if (!isToolTipOpen) {
        el.closest('body').querySelector('.tooltip').classList.add('tooltipToggle');
        isToolTipOpen = true;
    } else {
        closeToolTip(el);
    }
}


/**
 * close Tooltip 'Log Out' by Click on Image Profile
 * @param {this} el 
 */
function closeToolTip(el) {
    el.closest('body').querySelector('.tooltip').classList.remove('tooltipToggle');
    isToolTipOpen = false;
}


/**
 * compares the url (http://..../board.html with the parameter ('board.html)
 * @param {string} page href
 * @returns if (class 'active-link') else (empty String)
 */
function isCurrentSite(page) {
    let url = window.location.href;
    if (url.indexOf(page) > -1) {
        return 'active-link';
    } else {
        return "";
    }
}


/**
 * generate Navigation and function isCurrentSite is called and passes either class or nothing
 */
function generateNav() {
    let menuContent = document.getElementById('menu-content');
    let menuContentResponsiv = document.getElementById('menu-content-responsiv');
    menuContent.innerHTML = '';
    menuContentResponsiv.innerHTML = '';

    menuContent.innerHTML += generateMenuContent();
    menuContentResponsiv.innerHTML  += generateMenuContentResponsiv();
}


function generateMenuContent() {
    return /*html*/`
        <a href="summary.html" class="link ${isCurrentSite('summary.html')}">
            <img src="assets/img/summary.png">Summary
        </a>
        <a href="board.html" class="link ${isCurrentSite('board.html')}">
            <img src="assets/img/board.png">Board
        </a>
        <a href="add_task.html" class="link ${isCurrentSite('add_task.html')}">
            <img src="assets/img/addTask.png">Add Task
        </a>
        <a href="contacts.html" class="link ${isCurrentSite('contacts.html')}">
            <img src="assets/img/contacts.png">Contacts
        </a>`;
}


function generateMenuContentResponsiv() {
    return /*html*/`
        <a href="summary.html" class="link ${isCurrentSite('summary.html')}">
            <img src="assets/img/summary.png">Summary
        </a>
        <a href="board.html" class="link ${isCurrentSite('board.html')}">
            <img src="assets/img/board.png">Board
        </a>
        <a href="add_task.html" class="link ${isCurrentSite('add_task.html')}">
            <img src="assets/img/addTask.png">Add Task
        </a>
        <a href="contacts.html" class="link ${isCurrentSite('contacts.html')}">
            <img src="assets/img/contacts.png">Contacts
        </a>`;
}



/**
 * generate Header with profil Image Guest or registred user
 */
function generateHeader() {
    let headerContent = document.getElementById('header-content');
    let user = JSON.parse(localStorage.getItem('currentUser'));

    if(user) { 
        for (let i = 0; i < user.length; i++) {
            headerContent.innerHTML = '';
            headerContent.innerHTML += /*html*/`
                <div onclick="openTooltip(this)" class="profile-image" style="background:${user[i]['color']}" id="profileUser">${user[i]['initials']}</div>
                    <a href="index.html">
                        <div class="tooltip">
                            <span class="tooltipText">Log out</span>
                            <a class="help-responsiv" href="help.html">Help</a>
                            <a class="legal-notice-responsiv" href="legal_notice.html">Legal Notice</a>
                        </div>
                    </a>`;
        } 
    } else {
        headerContent.innerHTML = '';
        headerContent.innerHTML += /*html*/`
            <div onclick="openTooltip(this)" class="profile-guest" id="profileUser">
                <img class="profile-guest-image" src="assets/img/guest-user.png">
            </div>
                <a href="index.html">
                    <div id="tooltip" class="tooltip">
                        <span class="tooltipText">Log out</span>
                        <a class="help-responsiv" href="help.html">Help</a>
                        <a class="legal-notice-responsiv" href="legal_notice.html">Legal Notice</a>
                    </div>
                </a>`;
    }
    
}

/* created a new Event */
const AfterincludeHTMLFunctionEvent = new Event("AfterincludeHTMLFunctionEvent");

/* Function is only called after loading the HTML page, without writing 'onload' on each HTML page. */
document.addEventListener('DOMContentLoaded', function() {
    includeHTML();
});


/* Functions are only loaded AFTER IncludeHTML() */
document.addEventListener('AfterincludeHTMLFunctionEvent', function() {
    generateNav();
    generateHeader();
});





