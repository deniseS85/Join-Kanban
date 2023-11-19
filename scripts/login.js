let currentUser = [];

async function initLogin() {
    await includeHTML();
    localStorage.clear();
    setURL('https://denise.selfcoders.com/join_kanban/smallest_backend_ever');
    await contactsLoadFromDB(); // load Users from Database
}

async function contactsLoadFromDB() {
    await downloadFromServer();
    usersArray = JSON.parse(backend.getItem('users')) || [];
}

async function addToDBUsers() {
    await backend.setItem('users', JSON.stringify(usersArray));
}

function initAnimation() {
    generateHTMLLogin();
    let animation = document.getElementById('init-animation');
    let animationLogo = document.getElementById('init-animation-img');
    let logo = document.getElementById('logo-black');
    let header = document.getElementById('login-header');
   
    if (window.innerWidth > 750) {
        animation.classList.add('desktop-bg');
        animationLogo.classList.add('desktop-logo');
    } else {
        animation.classList.add('mobile-bg');
        animationLogo.classList.add('mobile-logo');
    }

    setTimeout(function () {
        animation.classList.remove('desktop-bg', 'mobile-bg');
        animationLogo.classList.remove('desktop-logo', 'mobile-logo');
        logo.style.visibility = 'visible';
        header.style.zIndex = '1';
    }, 3000);
}

function login() {
    let user = usersArray.find(c => c.email == email.value && c.password == password.value);
    let messageLogin = document.getElementById('messageLogin');
   
    if(!user) {
        messageLogin.style.display = 'flex';
        messageLogin.innerHTML = '';
        messageLogin.innerHTML = generateHTMLNotUserMessage();
    } else {
        currentUser.push(user);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href='summary.html';
    }
    email.value = '';
    password.value = '';
}

function forgot() {
    let messageForgot = document.getElementById('messageForgot');

    messageForgot.style.display = 'flex';
    messageForgot.innerHTML = '';
    messageForgot.innerHTML = generateHTMLForgotMessage();

    setTimeout(function() { 
        messageForgot.style.display = 'none';
        document.getElementById('forgotMail').value = '';
        generateHTMLReset();
    }, 2200);
}

function resetPasswort() {
    let messageReset = document.getElementById('messageReset');
    let firstPassword = document.getElementById('firstPassword');
    let secondPassword = document.getElementById('secondPassword');

    messageReset.style.display = 'flex';
    messageReset.innerHTML = '';
    
    if (firstPassword.value != secondPassword.value) {
        firstPassword.setCustomValidity('Password must be the same!');
    } else if (firstPassword.value == "" || secondPassword.value == "") {
        firstPassword.setCustomValidity('Password cannot be empty!');
    } else {
        firstPassword.setCustomValidity('');
        messageReset.innerHTML = generateHTMLResetMessage();

        setTimeout(function() { 
            messageReset.style.display = 'none';
            firstPassword.value = '';
            secondPassword.value = '';
            generateHTMLLogin();
        }, 2200);
    }
}

async function addUser() {
    let user = usersArray.find(c => c.email == newEmail.value);
    let messageSignUp = document.getElementById('messageSignUp');
    let newMail = document.getElementById('newEmail').value.toLowerCase();
    let checkMail = validateEmail(newMail);

    messageSignUp.style.display = 'flex';
    messageSignUp.innerHTML = '';

    if(!user && Boolean(checkMail) == true) {
        pushNewContactToArray();
        messageSignUp.innerHTML = generateHTMLSignUpMessage();

        setTimeout(() => {
            messageSignUp.style.display = 'none';
            generateHTMLLogin();

        }, 2200);

    } else {
        messageSignUp.innerHTML = generateHTMLSignUpIsUserMessage();
    } 
    newFirstName.value = '';
    newLastName.value = '';
    newEmail.value = '';
    newPhone.value = '';
    newPassword.value = '';

    await addToDBUsers();
}

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

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
