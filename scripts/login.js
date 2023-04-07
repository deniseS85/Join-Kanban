let currentUser = [];

async function initLogin() {
    await includeHTML();
    localStorage.clear();
    setURL('https://denise-siegl.developerakademie.net/join_kanban/smallest_backend_ever');
    await contactsLoadFromDB(); // load Users from Database
}

async function contactsLoadFromDB() {
    await downloadFromServer();
    usersArray = JSON.parse(backend.getItem('users')) || [];
}

async function addToDBUsers() {
    await backend.setItem('users', JSON.stringify(usersArray));
}


/**
 * start animation logo
 */
function initAnimation() {
    let animation = document.getElementById('init-animation');
    let animationImg = document.getElementById('init-animation-img');
    setTimeout(function () {
        animation.style.display = 'none';
        animationImg.style.display = 'none';
    }, 2420);
}


function initAnimationResponsiv() {
    let animation = document.getElementById('init-animation-responsiv');
    let animationImg = document.getElementById('init-animation-img-responsiv');
    setTimeout(function () {
        animation.style.display = 'none';
        animationImg.style.display = 'none';
    }, 2420);
}


/**
 * check if user is already exist, if yes, foward to summary.html
 * if not, option to sign up
 */
function login() {
    let user = usersArray.find(c => c.email == email.value && c.password == password.value);
    let message = document.getElementById('message');
    let messageResponsiv = document.getElementById('confirm-text-responsiv-login');
   
    if(!user) {
        message.style.display = 'flex';
        message.innerHTML = generateHTMLifNotUserDesktop();
        messageResponsiv.style.display = 'inline';
        document.getElementById('header-right-responsiv').style.display = 'none';
        messageResponsiv.innerHTML = generateHTMLifNotUserMobile();
    } else {
        currentUser.push(user);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href='summary.html';
    }
    email.value = '';
    password.value = '';
}


function generateHTMLifNotUserDesktop() {
    return /*html*/ `
        <div id="popUpBg" class="confirm-send-mail" onclick="closeOverlay()">
            <div class="confirm-box">
                <div onclick="doNotCloseOverlay(event)" class="register-text">You are not registered yet.<br> Click 
                    <span class="here" onclick="openSignUp(this)">here</span> to sign up
                </div>
            </div>
        </div>`;
}

function generateHTMLifNotUserMobile() {
    return /*html*/`
        You are not registered yet.<br> Click 
            <span class="here-responsiv" onclick="openSignUp(this)">here</span> to sign up`;
}


/**
 * show confirmation popup by do click on button
 * @param {this} el 
 */
function confirmSendMail(el) {
    el.closest('.forgot-inklusive-responsiv').querySelector('.confirm-send-mail').style.display = 'flex';
    el.closest('.forgot-inklusive-responsiv').querySelector('.confirm-text-responsiv').style.display = 'flex';
    let confirmText = document.getElementById('confirm-text-responsiv');
    confirmText.innerHTML = '';
    confirmText.innerHTML = /*html*/`
        <img src="assets/img/sendCheck.png">
        An E-Mail has been sent to you`;

    setTimeout(() => {
        el.closest('.login-container').querySelector('.forgot-inklusive-responsiv').style.display = 'none';
        el.closest('.forgot-inklusive-responsiv').querySelector('.confirm-text-responsiv').style.display = 'none';
        el.closest('.login-container').querySelector('.reset-inklusive-responsiv').style.display = 'flex';
    }, 2200);
}


function resetPasswort(el) {
    let firstPassword = document.getElementById('firstPassword');
    let secondPassword = document.getElementById('secondPassword');
    let sendText = document.getElementById('confirm-send-mail-responsiv');
    sendText.innerHTML = '';
    
    if (firstPassword.value != secondPassword.value) {
        firstPassword.setCustomValidity('Password must be the same!');
        firstPassword.value = '';
        secondPassword.value = '';
    } else if (firstPassword.value == "" || secondPassword.value == "") {
        firstPassword.setCustomValidity('Password cannot be empty!');
        firstPassword.value = '';
        secondPassword.value = '';
    } else {
        firstPassword.setCustomValidity('');
        sendText.innerHTML = /*html*/`
            You reset your password`;

        el.closest('.reset-inklusive-responsiv').querySelector('.confirm-send-mail').style.display = 'flex';
        el.closest('.reset-inklusive-responsiv').querySelector('.confirm-send-mail-responsiv').style.display = 'flex';
        resetSetTimeout(el); 
    }
}

function resetSetTimeout(el) {
    setTimeout(() => {
        el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'flex';
        el.closest('.login-container').querySelector('.reset-inklusive-responsiv').style.display = 'none';
        el.closest('.reset-inklusive-responsiv').querySelector('.confirm-send-mail-responsiv').style.display = 'none';
        el.closest('.login-container').querySelector('.header-right').style.visibility = 'visible';
        document.getElementById('confirm-text-responsiv-login').style.display = 'none';
        document.getElementById('confirm-text-responsiv-login').innerHTML = '';  
        el.closest('.login-container').querySelector('.header-right-responsiv').style.display = 'flex';
        firstPassword.value = '';
        secondPassword.value = '';
    }, 2200);
}


/**
 * check if user is already exist, if not add new user and load in database
 */
async function addUser() {
    let user = usersArray.find(c => c.email == newEmail.value);
    console.log(newEmail.value)
    let message = document.getElementById('messageNewUser');
    let messageResponsiv = document.getElementById('confirm-text-responsiv-sign-up');
    let newMail = document.getElementById('newEmail').value.toLowerCase();
    let checkMail = validateEmail(newMail);
    message.style.display = 'flex';
    messageResponsiv.style.display = 'inline';
    
    if(!user && Boolean(checkMail) == true) {
        pushNewContactToArray();

        message.innerHTML = generateHTMLRegistrationDesktop();
        messageResponsiv.innerHTML = generateHTMLRegistrationMobile();

        setTimeout(() => {
            openSignUpAfterRegister();
            message.style.display = 'none';
            messageResponsiv.style.display = 'none';
        }, 2200);

    } else {
        message.innerHTML = generateHTMLIsUserDesktop();
        messageResponsiv.innerHTML = generateHTMLIsUserMobile();
    } 
    newFirstName.value = '';
    newLastName.value = '';
    newEmail.value = '';
    newPhone.value = '';
    newPassword.value = '';

    await addToDBUsers();
}


function generateHTMLRegistrationDesktop() {
    return /*html*/ `
        <div id="popUpBg" class="confirm-send-mail" onclick="closeOverlay()"> 
            <div class="confirm-box">
                <div onclick="doNotCloseOverlay(event)" class="register-text-new">You have successfully registered.</div>  
            </div>
        </div>`;
}


function generateHTMLRegistrationMobile() {
    return  /*html*/ `
        You have successfully registered.`;
}


function generateHTMLIsUserDesktop() {
    return /*html*/`
        <div id="popUpBg" class="confirm-send-mail" onclick="closeOverlay()"> 
            <div class="confirm-box">
                <div onclick="doNotCloseOverlay(event)" class="register-text">You are already registered.<br> Click
                    <span onclick="openLogIn(this)" class="here">here</span> to login up
                </div>
            </div>
        </div>`;
}


function generateHTMLIsUserMobile() {
    return /*html*/`
        You are already registered. Click
        <span onclick="openLogIn(this)" class="here-responsiv">here</span> to login up`;
}


/**
 * add new contact in usersArray
 */
function pushNewContactToArray() {
    usersArray.push({
        firstname: newFirstName.value.charAt(0).toUpperCase() + newFirstName.value.slice(1),
        lastname: newLastName.value.charAt(0).toUpperCase() + newLastName.value.slice(1),
        email: newEmail.value, 
        phone: newPhone.value,
        initials: newFirstName.value.charAt(0).toUpperCase() + newLastName.value.charAt(0).toUpperCase(),
        color: getRandomColor(),
        password: newPassword.value
    });
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
 * close popups by click on the side
 */
function closeOverlay() {
    document.getElementById('popUpBg').style.display = 'none';
}


/* ===========  switch between opening and closing of the popups  ========================= */
function openLogIn(el) {
    el.closest('.login-container').querySelector('.sign-up-content-responsiv').style.display = 'none';
    el.closest('.sign-up-content-responsiv').querySelector('.msg-box').style.display = 'none';
    el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'flex';
    el.closest('.login-container').querySelector('.header-right').style.display = 'flex';
    document.getElementById('message').style.display = 'none';
    document.getElementById('message').innerHTML = '';
}

function openSignUp(el) {
    el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'none';
    el.closest('.login-container').querySelector('.header-right').style.display = 'none';
    el.closest('.login-container').querySelector('.sign-up-content-responsiv').style.display = 'flex';
    document.getElementById('message').style.display = 'none';
    document.getElementById('message').innerHTML = '';
    document.getElementById('confirm-text-responsiv-sign-up').style.display = 'none';
    document.getElementById('confirm-text-responsiv-sign-up').innerHTML = '';
}

function closeSignUp(el) {
    el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'flex';
    el.closest('.login-container').querySelector('.header-right').style.display = 'flex';
    el.closest('.login-container').querySelector('.header-right-responsiv').style.display = 'flex';
    el.closest('.login-container').querySelector('.sign-up-content-responsiv').style.display = 'none';
    document.getElementById('message').innerHTML = '';
    document.getElementById('message').style.display = 'none';
    document.getElementById('confirm-text-responsiv-login').style.display = 'none';
    document.getElementById('confirm-text-responsiv-login').innerHTML = '';

}

function openSignUpAfterRegister() {
    document.getElementById('signUpContent').style.display = 'none';
    document.getElementById('login-inclusive-responsiv').style.display = 'flex';
    document.getElementById('header-right').style.display = 'flex';
}

function openForgotPasswort(el) {
    el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'none';
    el.closest('.login-container').querySelector('.header-right').style.visibility = 'hidden';
    el.closest('.login-container').querySelector('.forgot-inklusive-responsiv').style.display = 'flex';
    document.getElementById('forgot-mail').value = '';
    document.getElementById('confirmSendMail').style.display = 'none';
    document.getElementById('resetYourPassword').style.display = 'none';
}

function closeForgotPasswort(el) {
    el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'flex';
    el.closest('.login-container').querySelector('.login-header').style.visibility = 'visible';
    el.closest('.login-container').querySelector('.header-right-responsiv').style.display = 'flex';
    el.closest('.login-container').querySelector('.forgot-inklusive-responsiv').style.display = 'none';
    document.getElementById('reset-content').style.display = 'none';
    el.closest('.login-container').querySelector('.header-right').style.visibility = 'visible';
    document.getElementById('confirm-text-responsiv-login').style.display = 'none';
    document.getElementById('confirm-text-responsiv-login').innerHTML = '';
}

function closeResetPasswort(el) {
    el.closest('.login-container').querySelector('.login-header').style.visibility = 'visible';
    el.closest('.login-container').querySelector('.reset-inklusive-responsiv').style.display = 'none';
    el.closest('.login-container').querySelector('.forgot-inklusive-responsiv').style.display = 'flex';
    document.getElementById('forgot-mail').value = '';
    document.getElementById('confirmSendMail').style.display = 'none';  
}

