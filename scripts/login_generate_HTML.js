function generateHTMLLogin() {
    let loginContainer = document.getElementById('login-container');
    let headerRight = document.getElementById('header-right');

    headerRight.style.display = 'flex';
    loginContainer.innerHTML = '';
    loginContainer.innerHTML += /*html*/`
        <div class="login-content">
            <div class="title">
                <div>Log in</div>
            </div>
            <img class="underline" src="assets/img/login-underline.png">

            <form onsubmit="login(); return false";>
                <div class="login-input">
                    <div class="mail">
                        <input id="email" type="email" name="email" placeholder="Email" required autocomplete="on">
                        <img src="assets/img/mail-icon.png">
                    </div>
                    <div class="mail">
                        <input id="password" type="password" name="password" placeholder="Password" required autocomplete="on">
                        <img src="assets/img/passwort-icon.png">
                    </div>
                </div>
                <div class="password-check">
                    <div class="remember-passwort">
                        <input type="checkbox" id="checkbox">
                        <label class="not-markable" for="checkbox">Remember Me</label>
                    </div>
                    <div onclick="generateHTMLForgot()" class="forgot-passwort">Forgot my password</div>
                </div>
                <div class="login-btn">
                    <button>Log in</button>
                    <button onclick="window.location.href='summary.html'">Guest Log in</button>
                </div>
                <div id="messageLogin" style="display:none"></div> 
            </form>
        </div>`;
}


function generateHTMLNotUserMessage() {
    return /*html*/`
        <div id="popUpBg" class="popUpBg" onclick="closeOverlay()">
            <div class="confirm-box">
                <div onclick="doNotCloseOverlay(event)" class="register-text">You are not registered yet.<br> Click 
                    <span class="here" onclick="generateHTMLSignUp()">here</span> to sign up
                </div>
            </div>
        </div>`;
}


function generateHTMLForgot() {
    let loginContainer = document.getElementById('login-container');
    let headerRight = document.getElementById('header-right');

    headerRight.style.display = 'none';
    loginContainer.innerHTML = '';
    loginContainer.innerHTML += /*html*/`
        <div class="login-content">
            <div class="title-container">
                <img onclick="generateHTMLLogin()" src="assets/img/arrow-right-blue.png">
                <div class="title">I forgot my password</div>
            </div>
            <img class="underline" src="assets/img/login-underline.png">
            <div class="forgot-text">Don't worry! We will send you an email with the instructions to reset your password.</div>
            <form onsubmit="forgot(); return false;">
                <div class="login-input">
                    <div class="mail">
                        <input id="forgotMail" type="email" placeholder="Email" required>
                        <img src="assets/img/mail-icon.png">
                    </div>
                </div>
                <button class="forgot-btn">Send me the email</button>
            </form>
        </div>
        <div id="messageForgot" style="display:none"></div>`;
}


function generateHTMLForgotMessage() {
    return /*html*/`
        <div id="popUpBg" class="popUpBg" onclick="closeOverlay()">
            <div class="confirm-box">
                <img class="send-forgot-img" src="assets/img/sendCheck.png">
                <div class="register-text">An E-Mail has been sent to you</div>
            </div>
        </div>`;
}


function generateHTMLReset() {
    let loginContainer = document.getElementById('login-container');
    let headerRight = document.getElementById('header-right');

    headerRight.style.display = 'none';

    loginContainer.innerHTML = '';
    loginContainer.innerHTML += /*html*/`
        <div class="login-content">
            <div class="title-container">
                <img onclick="generateHTMLForgot()" src="assets/img/arrow-right-blue.png">
                <div class="title">Reset your password</div>
            </div>
            <img class="underline" src="assets/img/login-underline.png">
            <div class="forgot-text">Change your account password</div>
            <form onsubmit="return false">
                <div class="login-input">
                    <div class="mail">
                        <input id="firstPassword" type="password" placeholder="New password" required>
                        <img src="assets/img/mail-icon.png">
                    </div>
                    <div class="mail">
                        <input id="secondPassword" type="password" placeholder="Confirm password" required>
                        <img class="send-forgot-img" src="assets/img/mail-icon.png">
                    </div>
                </div>
                <button onclick="resetPasswort()" class="forgot-btn">Continue</button>
            </form>
        </div>
        <div id="messageReset" style="display: none;"></div>`;
}


function generateHTMLResetMessage() {
    return /*html*/`
        <div id="popUpBg" class="popUpBg" onclick="closeOverlay()">
            <div class="confirm-box">
                <img src="assets/img/sendCheck.png">
                <div class="register-text">You reset your password</div>
            </div>
        </div>`;
}

function generateHTMLSignUp() {
    let loginContainer = document.getElementById('login-container');
    let headerRight = document.getElementById('header-right');

    headerRight.style.display = 'none';

    loginContainer.innerHTML = '';
    loginContainer.innerHTML += /*html*/`
        <div class="login-content">
            <div class="title-container">
                <img onclick="generateHTMLLogin()" src="assets/img/arrow-right-blue.png">
                <div class="title">Sign up</div>
            </div>
            <img class="underline" src="assets/img/login-underline.png">

            <form onsubmit="addUser(); return false">
                <div class="login-input">
                    <div class="mail new-user-input">
                        <input id="newFirstName" type="name" placeholder="Firstname" required>
                        <img src="assets/img/sign-up-name.png">
                        <input id="newLastName" type="name" placeholder="Lastname" required>
                        <img src="assets/img/sign-up-name.png">
                    </div>
                    <div class="mail">
                        <input id="newPhone" type="tel" placeholder="Phone" required>
                        <img class="mail-img" src="assets/img/phone.png">
                    </div>
                    <div class="mail new-user-input">
                        <input id="newEmail" type="email" placeholder="Email" required>
                        <img src="assets/img/mail-icon.png">
                        <input id="newPassword" type="password" placeholder="Password" required>
                        <img src="assets/img/passwort-icon.png">
                    </div>
                </div>
                <button class="forgot-btn">Sign up</button>
            </form>
        </div>
        <div id="messageSignUp" style="display: none;"></div>`;
}

function generateHTMLSignUpMessage() {
    return /*html*/`
        <div id="popUpBg" class="popUpBg" onclick="closeOverlay()">
            <div class="confirm-box">
                <img class="send-forgot-img" src="assets/img/sendCheck.png">
                <div class="register-text">You Signed Up successfully</div>
            </div>
        </div>`;
}


function generateHTMLSignUpIsUserMessage() {
    return /*html*/`
        <div id="popUpBg" class="popUpBg" onclick="closeOverlay()"> 
            <div class="confirm-box">
                <div onclick="doNotCloseOverlay(event)" class="register-text">You are already registered.<br> Click
                    <span class="here" onclick="generateHTMLLogin()">here</span> to login up
                </div>
            </div>
        </div>`;
}

