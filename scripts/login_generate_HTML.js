function generateLoginHTML() {
    let loginContainer = document.getElementById('login-container');

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
                    <div onclick="generateForgotHTML()" class="forgot-passwort">Forgot my password</div>
                </div>
                <div class="login-btn">
                    <button>Log in</button>
                    <button onclick="window.location.href='summary.html'">Guest Log in</button>
                </div>
                <div id="message" style="display:none"></div> 
            </form>
        </div>`;
}

function generateForgotHTML() {
    let loginContainer = document.getElementById('login-container');

    loginContainer.innerHTML = '';

    loginContainer.innerHTML += /*html*/`
        <div class="login-content">
            <div class="title-container">
                <img onclick="closeForgotPasswort(this)" src="assets/img/arrow-right-blue.png">
                <div class="title">I forgot my password</div>
            </div>
            <img class="underline" src="assets/img/login-underline.png">
            <div class="forgot-text">Don't worry! We will send you an email with the instructions to reset your password.</div>
            <!-- ///////// hier weitermachen -->
            <form onsubmit="confirmSendMail(this); return false;">
                <div class="login-input" style="height:70px">
                    <div class="mail">
                        <input id="forgot-mail" type="email" placeholder="Email" required>
                        <img src="assets/img/mail-icon.png">
                    </div>
                </div>
                <button class="forgot-btn">Send me the email</button>
            </form>

            <div id="confirmSendMail" class="confirm-send-mail" style="display: none;">
                <div class="confirm-box">
                    <div class="confirm-text">
                        <img src="assets/img/sendCheck.png">
                        An E-Mail has been sent to you
                    </div>
                </div>
            </div>
        </div>
        <div class="confirm-text-responsiv" id="confirm-text-responsiv" style="display: none;"></div>`;
  /*   
    el.closest('.login-container').querySelector('.login-inclusive-responsiv').style.display = 'none';
    el.closest('.login-container').querySelector('.header-right').style.visibility = 'hidden';
    el.closest('.login-container').querySelector('.forgot-inklusive-responsiv').style.display = 'flex';
    document.getElementById('forgot-mail').value = '';
    document.getElementById('confirmSendMail').style.display = 'none';
    document.getElementById('resetYourPassword').style.display = 'none'; */
}



function generateHTMLNotUser() {
    return /*html*/`
        <div id="popUpBg" class="popUpBg" onclick="closeOverlay()">
            <div class="confirm-box">
                <div onclick="doNotCloseOverlay(event)" class="register-text">You are not registered yet.<br> Click 
                    <span class="here" onclick="openSignUp(this)">here</span> to sign up
                </div>
            </div>
        </div>`;
}

