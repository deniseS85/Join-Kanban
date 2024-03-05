
// shows left side / contacts 
function contactListHTML(id, color, initials, firstName,lastName, email, phone){
    return /*html*/`
      <div class="d-flex gap center margin-b c-pointer" id="${id}" onclick="showContact('${color}','${initials}','${firstName}','${lastName}','${email}','${phone}')">
          <div class="profil-logo" style="background-color: ${color}">${initials}</div>
          <div class="column">
              <div class="d-flex small-gap">
                <div class="name">${firstName}</div>
                <div class="name">${lastName}</div>
              </div>
              <div class="email">${email.toLowerCase()}</div>
          </div>
      </div>`;
}


// shows right side / header title 
function contactsHeaderHTML(){
    return /*html*/`
      <div class="d-flex gap contacts-header">
          <div class="font">Contacts</div>
          <img class="lineOfHeader" src="assets/img/strich.png">
          <div class="sub-font">Better with a team</div>
          <img onclick="showContactsMobile()" class="back-arrow-c" src="assets/img/pfeilLinks.png"/>
      </div>`;
}


// shows right side / clicked contact
function showClickedContact(color, initials, firstName,lastName, email, phone){
    return /*html*/`
        <div class="slide-in">
            <div class="right-contacts d-flex r-gap margin-top">
                <div class="r-profil-logo" style="background-color: ${color}">${initials}</div>
                <div class="d-flex column">
                    <div id="${firstName}${lastName}" class="r-name">${firstName} ${lastName}</div>
                    <div onclick="overlayAddTaskContacts('${email}') ,initAddTaskElements()" class="add-task">+ Add Task</div>
                </div>
            </div>
            <div class="d-flex margin-top">
                <div class="margin-right contactInfo">Contact Information</div>
                <div onclick="editContact('${color}','${initials}','${firstName}','${lastName}','${email}','${phone}')" class="d-flex">
                    <img class="symbol c-p"" src="assets/img/pencil2.png"/>
                    <div class="c-p">Edit Contact</div>
                </div>
            </div>
            <div class="d-flex column margin-top gap">
                <div class="r-email">Email</div>
                <a href="mailto:${email}" class="email" style="text-decoration: none;">${email}</a>
            </div>
            <div class="d-flex column margin-top gap">
                <div class="r-email">Telefon</div>
                <a href="tel:${phone}" class="phone">${phone}</a>
            </div>
        </div>`;
}
// shows overlay for edit contact
function editContactHTML(color, initials, firstName,lastName, email, phone){
  return /*html*/`
    <div id="popup" onclick="doNotCloseOverlay(event)">
        <div class="d-flex popUp">
        <div id="designOfAddC" class="designFlex">
        <img id="logoOfAddContact" class="join-logo-a margin-b" src="assets/img/logo.png"/>
        <div class="addContactDesign margin-b">Edit Contact</div>
        <img class="strich-add" src="assets/img/Vector5.png"/>
    </div>
    <div class="user mobileUser">
          <h2 id="shortNameId" class="r-profil-logo larger editPopUp" style="background-color: ${color}" >${initials}</h2>
    </div>
    <div class="column margin-l m-gap new-margin editMobile">
        <div class="close">
            <img onclick="closeOverlayContacts()" class="editMobileClose" src="assets/img/close.png" />
        </div>
        <div class="firstAndLastInput">
            <input id="firstNameId" class="input-fields"  value="${firstName}" placeholder="Name" type="text">
            <input id="lastNameId" class="input-fields"  value="${lastName}" placeholder="Name" type="text">
        </div>
        <div class="emailAndPhoneInput">
            <input id="emailId" class="input-fields"  value="${email}" placeholder="Email" type="email">
            <input id="originalEmailId" class="input-fields"  value="${email}" type="hidden">
            <input id="phoneId" class="input-fields"  value="${phone}" placeholder="Phone" type="tel">
        </div>
        <div class="d-flex gap1" >
          <button onclick="saveEditContact()" class="d-flex margin-ll btn-save btn-edit">
              <div class="create-c1">Save</div>
              <img class="done-icon1" src="assets/img/done.png" />  
          </button>
        </div>
    </div>`;
}


// shows right side / button 
function showContactButtonHTML() {
  let button = document.getElementById('add-contact');
  button.innerHTML = /*html*/` 
      <button onclick="addContact()" class="position">
          <div  class="button-text">Add contact</div>
          <img class="addContactButtonSymbol"src="assets/img/addContact.png">
      </button>`;
}



// shows overlay for adding new contact
function addContactHTML() {
  return /*html*/`
    <div id="popup" onclick="doNotCloseOverlay(event)">
        <div class="d-flex popUp">
            <div id="designOfAddC" class="designFlex">
                <img id="logoOfAddContact" class="join-logo-a margin-b" src="assets/img/logo.png"/>
                <div class="addContactDesign">Add Contact</div>
                <div class="task-subtitle margin-b">Tasks are better with a team!</div>
                <img class="strich-add" src="assets/img/Vector5.png"/>
            </div>
            <div class="user">
                <img class="user-design userAddC" src="assets/img/user.png"/>
            </div>
            <div class="column margin-l m-gap new-margin paddingOfInput">
                <div class="close margin-b">
                    <img onclick="closeOverlayContacts()" class="close-icon" src="assets/img/close.png" />
                </div>
                <div class="firstAndLastInput">
                    <input id="firstNameId" value="" class="input-fields" placeholder="Firstname" type="text">
                    <input id="lastNameId" value="" class="input-fields" placeholder="Surname" type="text">
                </div>
                <div class="emailAndPhoneInput">
                    <input id="emailId" class="input-fields" placeholder="Email" type="email">
                    <input  id="phoneId" class="input-fields margin-b" placeholder="Phone" type="tel">
                </div>
                <div class="d-flex gap1 buttonsOfAddC" >
                    <button onclick="cancelValues()" class="d-flex btn1">
                        <div class="cancel">Cancel</div>
                        <img class="close-icon1" src="assets/img/close.png" />  
                    </button>
                    <button onclick="createContact()" class="d-flex btn2">
                        <div class="create-c">Create Contact</div>
                        <img class="done-icon1" src="assets/img/done.png" />  
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
