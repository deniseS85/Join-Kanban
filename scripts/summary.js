let futureDate = [];

async function initSummary() {
    await includeHTML();
    setURL('https://denise-siegl.developerakademie.net/join_kanban/smallest_backend_ever');
    await loadFromDB();
    generateHeader();
    generateNav();
}


/**
 * Loads tasks data from the server and updates the tasks array.
 */
 async function loadFromDB() {
    await downloadFromServer(); 
    taskArray = JSON.parse(backend.getItem("tasks")) || []; 
    filterArray();
    getTime();
    getNameLogin();
    greetingResponsiv();
}


/**
 * get length of array and the status
 */
function filterArray() {
    let progress = taskArray.filter(t => t['status'] == 'progress');
    let await = taskArray.filter(t => t['status'] == 'await');
    let todo = taskArray.filter(t => t['status'] == 'ToDo');
    let done = taskArray.filter(t => t['status'] == 'done');
    let prioUrgent = taskArray.filter(t => t['prio'] == 1);
    
    document.getElementById('taskLength').innerHTML = taskArray.length;
    document.getElementById('progressLength').innerHTML = progress.length;
    document.getElementById('awaitLength').innerHTML = await.length;
    document.getElementById('todoLength').innerHTML = todo.length;
    document.getElementById('doneLength').innerHTML = done.length;
    document.getElementById('prioLength').innerHTML = prioUrgent.length;

    getDatePrioUrgent(prioUrgent);
}


/**
 * get time to write greeting text in actual time of day
 */
function getTime() {
    let now = new Date();
    let hour = now.getHours();
    let greeting = "Good ";

    if (hour >= 0 && hour < 12) {
        greeting += "morning";
    } else if (hour >= 12 && hour < 18) {
        greeting += "afternoon";
    } else {
        greeting += "evening";
    }
    document.getElementById('currentTime').innerHTML = greeting;
}


/**
 * get username by Login and write in greeting text
 */
function getNameLogin() {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
        for (let i = 0; i < user.length; i++) {
            let firstName = user[i]["firstname"];
            let lastName = user[i]["lastname"];
            document.getElementById('userNameLogin').innerHTML = firstName + " " + lastName;
        }
    } else {
        document.getElementById('userNameLogin').innerHTML = "Guest";
    }
}


/**
 * find dates push only future dates in array and find the closest date in future
 * @param {array} prioUrgent 
 */
function getDatePrioUrgent(prioUrgent) {
    for (let i = 0; i < prioUrgent.length; i++) {
        let urgentDates = prioUrgent[i]['due_date'];
        urgentDates = Date.parse(urgentDates);
      
        // push only the date in future
        if (new Date(urgentDates) > new Date()) {
          futureDate.push(urgentDates);
        }
    } 
    getMinDate();
}


/**
 * get the earliest date from today
 */
function getMinDate() {
    let minDate = Math.min(...futureDate);
    let day = new Date(minDate).getDate();
    let month = new Date(minDate).getMonth()+1;
    let year = new Date(minDate).getFullYear();

    if (prioUrgent.length == 0 || !day && !month && !year) {
          document.getElementById('prioUrgent').innerHTML = '---';
    } else {
          document.getElementById('prioUrgent').innerHTML = day + '.' + month + '.' + year;
    }
}


/**
 * in responsiv greeting text will be automatically hidden
 */
function greetingResponsiv() { 
    if (window.innerWidth <= 1100) {
        setTimeout(function () {
            showGreetingText();

            setTimeout(function () {
                hideGreetingText()
            }, 2000);
        }, 100);
    }
}


function showGreetingText() {
    let greeting = document.getElementById('greeting');
    greeting.style.display = 'block';
    greeting.style.transition = 'opacity 2s ease-in';
    greeting.style.marginTop = '300px';

    let summaryContent = document.getElementById('summaryContent');
    summaryContent.style.display = 'none';
}


function hideGreetingText() {
    greeting.style.display = 'none';
    summaryContent.style.display = 'block';
    summaryContent.style.transition = 'opacity 0.5s ease-in';
}

