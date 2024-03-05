let id = 0; // Variable id outside the function
let allContacts = [];
let taskForUser;


async function initContacts(){
    await includeHTML();
    setURL('https://denise.selfcoders.com/join_kanban/smallest_backend_ever');
    await loadUsers();
    generateHeader();
    generateNav();
}


/**
 * Loads users data from the server and updates the users, categoryArray, taskArray and contact list.
 */
async function loadUsers() { 
    await downloadFromServer(); 
    usersArray = JSON.parse(backend.getItem('users')) || []; 
    categoryArray = JSON.parse(backend.getItem('categories')) || []; 
    taskArray = JSON.parse(backend.getItem('tasks')) || []; 
    pushContactsByAlphabet();
}


/**
 * Sorts and groups the contact list by alphabetical order.
 */
function pushContactsByAlphabet() {
    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet[i];
        let letterAdded = true; // Variable to check if the letter has already been added
        for (let j = 0; j < usersArray.length; j++) {
            let user = usersArray[j];
            let firstLetter = user.lastname.charAt(0); //first Letter of Lastname
            if (firstLetter === letter) {
              if (letterAdded) {
                // Add the letter if it has not been added yet
                allContacts.push(letter);
                letterAdded = false; // The letter has been added
              }
              allContacts.push(user);
            }
        }
    }
    // Renders the updated contact list on the UI
    renderContent();
}


/**
 * Closes the overlay window for the contact list.
 */
function overlayAddTaskContacts(email){
    taskForUser = email;
    let popup = document.getElementById('task-overlay');
    document.getElementById('closeAddTask').style.display = 'flex';
    document.getElementById('header').classList.add('d-none');
    document.getElementById('body').style.overflowY = 'hidden';
    popup.style.display = 'block';
}


/**
 * Renders the contact list in the content area of the page.
 */
function renderContent() {
    let contactList = document.getElementById('content');
    contactList.innerHTML = '';
    for (let i = 0; i < allContacts.length; i++) {
        let user = allContacts[i];
        let color = user.color;
        let initials = user.initials;
        let firstName = user.firstname;
        let lastName = user.lastname;
        let email = user.email;
        let phone = user.phone;
      
    // If the color is undefined, only display the letter of the alphabet.
    if (color === undefined) {
        contactList.innerHTML += /*html*/` <h2 class="border">${user}</h2>`;
    } else {
      // Otherwise, display the contact information.
        contactList.innerHTML += contactListHTML(id, color, initials, firstName, lastName, email, phone);
        id++;
    }
  }
  let rightSide = document.getElementById('right-side');
  rightSide.innerHTML = contactsHeaderHTML();
  showContactButtonHTML();
}


/**
 * Shows the contact list on mobile devices by hiding the right-side panel and the show contact button.
 */
function showContactsMobile(){
    let contacts = document.getElementById('content');
    let rightSide = document.getElementById('right-side');
    let content = document.getElementById('showContact');
    
    // Show the contact list and hide the right-side panel and the show contact button.
    contacts.style.display = 'block';
    rightSide.style.display = 'none';
    content.style.display = 'none';
  }


/**
 * Shows the details of a clicked contact by filling the show contact div and hiding or showing the contact list and right-side panel depending on the screen size.
 * 
 * @param {string} color - The color of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function showContact(color, initials, firstName, lastName, email, phone) {
    let content = document.getElementById('showContact');
    let contacts = document.getElementById('content');
    let rightSide = document.getElementById('right-side');
    
    // Fill the show contact div with the details of the clicked contact.
    content.innerHTML = showClickedContact(color, initials, firstName, lastName, email, phone);
    
    // If the screen size is smaller than or equal to 1045px, hide the contact list and show the right-side panel and the show contact div.
    if (window.innerWidth <= 1045){
        contacts.style.display = 'none';
        rightSide.style.display = 'block';
        content.style.display = 'block';

    }
}


/**
 * Displays a contact form overlay to edit a contact's details.
 * @param {string} color - The color of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function editContact(color, initials, firstName, lastName, email, phone){
    // Get the overlay element by ID.
    let overlay = document.getElementById('overlay');
    // Set the display style of the overlay to 'block' to make it visible.
    overlay.style.display = 'block';
    // Set the content of the overlay to the HTML generated by the editContactHTML function.
    overlay.innerHTML = editContactHTML(color, initials, firstName, lastName, email, phone);
}


/**
 * Displays a contact form overlay to add a new contact.
 */
function addContact(){
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    overlay.innerHTML = addContactHTML();
}


/**
 * Retrieves the edited contact details from the form, validates them, and saves them.
 */
function saveEditContact(){

  // Retrieve the values of the input fields for first name, last name, email, and phone, and trim them.
    let firstName = document.getElementById('firstNameId').value.trim();
    let lastName = document.getElementById('lastNameId').value.trim();
    let email = document.getElementById('emailId').value.trim();
    let originalEmail = document.getElementById('originalEmailId').value.trim();
    let phone = document.getElementById('phoneId').value.trim(); 
    // Retrieve the input elements for first name, last name, email, and phone.
    let firstNameInput = document.getElementById('firstNameId');
    let lastNameInput = document.getElementById('lastNameId');
    let emailInput = document.getElementById('emailId'); 
    let phoneInput = document.getElementById('phoneId'); 
    // Generate the initials for the contact based on the first and last name.
    let initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  
    // Validate the input fields and display error messages if necessary.
    if (validate(firstName, firstNameInput, lastName, lastNameInput, email, emailInput, originalEmail, phone, phoneInput, false)) {
      // If the input fields are valid, update the edited contact with the new details and close the overlay.
      changeEditedContact(firstName, lastName, email, phone, initials);
      closeOverlayContacts();
    }
}


/**
 * Validates the first name, last name, email, and phone input fields for a contact.
 * @param {string} firstName - The first name of the contact.
 * @param {object} firstNameInput - The input element for the first name.
 * @param {string} lastName - The last name of the contact.
 * @param {object} lastNameInput - The input element for the last name.
 * @param {string} email - The email address of the contact.
 * @param {object} emailInput - The input element for the email.
 * @param {string} phone - The phone number of the contact.
 * @param {object} phoneInput - The input element for the phone number.
 * @param {boolean} existingEmail - Indicates whether the email address is already used by another contact.
 * @returns {boolean} Returns true if the input fields are valid, and false otherwise.
 */
function validate(firstName, firstNameInput, lastName, lastNameInput, email, emailInput, originalEmail, phone, phoneInput, isNewContact){

  // Check if the first name has at least 2 characters.
  if (firstName.length < 2){
      firstNameInput.setCustomValidity("Bitte min. 2 Zeichen eingeben");
      firstNameInput.reportValidity();
      return false; // Validation failed
  }
  // Check if the last name has at least 2 characters.
  if (lastName.length < 2){
      lastNameInput.setCustomValidity("Bitte min. 2 Zeichen eingeben");
      lastNameInput.reportValidity();
      return false; // Validation failed
  }
  // Check if the email address contains an '@' symbol.
  if (!email.includes('@')){
      emailInput.setCustomValidity("Bitte gültige Email eingeben!");
      emailInput.reportValidity();
      return false; // Validation failed
  }
  // Check if the phone number contains only digits and has at least 8 characters.
  if (isNaN(phone) || phone.length < 8){
      phoneInput.setCustomValidity("Bitte gültige Nummer eingeben!");
      phoneInput.reportValidity();
      return false; // Validation failed
  }
  // Check if the first name starts with an uppercase letter.
  if (firstName.charAt(0) !== firstName.charAt(0).toUpperCase()) {
      firstNameInput.setCustomValidity("Bitte Anfangsbuchstaben groß schreiben!");
      firstNameInput.reportValidity();
      return false; // Validation failed
  }
  // Check if the last name starts with an uppercase letter.
  if (lastName.charAt(0) !== lastName.charAt(0).toUpperCase()) {
      lastNameInput.setCustomValidity("Bitte Anfangsbuchstaben groß schreiben!");
      lastNameInput.reportValidity();
      return false; // Validation failed
  }
  
  if (isNewContact == true || originalEmail != email) {
    // Check if the email address is already used by another contact.
    for (let i = 0; i < usersArray.length; i++) {
        let user = usersArray[i];
        if(user.email === email) {
          emailInput.setCustomValidity("Email bereits vergeben!");
          emailInput.reportValidity();
          return false; // Validation failed
        }
    }
  }
  
  // All input fields are valid.
  return true;
}


/**
 * Changes the contact information of a user with the given first name or last name.
 * @param {string} firstName - The first name of the user to update.
 * @param {string} lastName - The last name of the user to update.
 * @param {string} email - The updated email address of the user.
 * @param {string} phone - The updated phone number of the user.
 * @param {string} initials - The updated initials of the user.
 */
function changeEditedContact(firstName, lastName, email, phone, initials) {
    // Iterate through the users array to find a user with the given first name or last name and update their information.
    for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].firstname === firstName || usersArray[i].lastname === lastName) {
            usersArray[i].firstname = firstName;
            usersArray[i].lastname = lastName;
            usersArray[i].email = email;
            usersArray[i].phone = phone;
            usersArray[i].initials = initials;
          break; // Stop the loop once the user has been found and updated.
        }
    }
    allContacts = []; // Empty the array to refill it with the updated information.
    pushContactsByAlphabet(); // Refill the array with the updated information.
    addToDBContacts(usersArray); // Update the contacts in the database with the new information.
    hiddenCurrentContact(); // Hide the current contact information.
}


/**
 * Hides the current contact information.
 */
function hiddenCurrentContact(){
    let currentContact = document.getElementById('showContact');
    currentContact.innerHTML = '';
}


/**
 * Adds the given users to the database.
 * @param {array} users - The users to add to the database.
 */
async function addToDBContacts(usersArray) {
  // Convert the users array to a JSON string and add it to the database using the backend.setItem() method.
    await backend.setItem('users', JSON.stringify(usersArray));
}


/**
 * Clears the values of the input fields for adding or editing a contact.
 */
function cancelValues() {
  // Get the input fields for first name, last name, email, and phone number.
    let firstName = document.getElementById('firstNameId');
    let lastName = document.getElementById('lastNameId');
    let email = document.getElementById('emailId');
    let phone = document.getElementById('phoneId');

    // Set the values of the input fields to an empty string to clear them.
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    phone.value = '';
}


/**
 * Creates a new contact object based on the values entered in the input fields,
 * adds it to the users array, and updates the contact list in the UI.
 */
function createContact() {
  // Get the values entered in the input fields for first name, last name, email, and phone number, and trim them.
    let firstName = document.getElementById('firstNameId').value.trim();
    let lastName = document.getElementById('lastNameId').value.trim();
    let email = document.getElementById('emailId').value.trim(); 
    let phone = document.getElementById('phoneId').value.trim(); 
    // Create initials for the contact by taking the first letter of the first name and last name and converting them to uppercase.
    let initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase(); 
    // Get the input fields for first name, last name, email, and phone number.
    let firstNameInput = document.getElementById('firstNameId');
    let lastNameInput = document.getElementById('lastNameId');
    let emailInput = document.getElementById('emailId'); 
    let phoneInput = document.getElementById('phoneId'); 

  // Create a new user object with the entered values and other default properties.
    let newUser = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phone,
      initials: initials,
      color: getRandomColor(),
      password: "",
    };
  // Validate the entered values before adding the new contact to the users array.
    if (validate(firstName, firstNameInput, lastName, lastNameInput, email, emailInput, "", phone, phoneInput, true)) {
      // Clear the allContacts array to be re-filled with the new or updated contact information.
      allContacts = [];
      // Add the new user object to the users array.
      usersArray.push(newUser);
      // Update the contact list in the UI.
      pushContactsByAlphabet();
      closeOverlayContacts();
      // Add the updated users array to the database.
      addToDBContacts(usersArray);
    }
}


/**
 * Returns a random color in HSL format.
 * @returns {string} - A random HSL color.
 */
function getRandomColor() {
  // Generate random values for hue, saturation, and lightness
    const hue = Math.floor(Math.random() * 360); // hue ranges from 0 to 360
    const saturation = Math.floor(Math.random() * 20) + 60; // saturation ranges from 60 to 80
    const lightness = Math.floor(Math.random() * 20) + 30; // lightness ranges from 30 to 50

    // Return the random color in HSL format
    return `HSL(${hue}, ${saturation}%, ${lightness}%)`;
}


function closeAddTaskPopUpC(){
  let popup = document.getElementById('task-overlay');
  popup.style.display = 'none';
  document.getElementById('header').classList.remove('d-none');
  document.getElementById('body').style.overflowY = '';
  assignToArray = [];
}


function closeOverlayContacts() {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}


/**
 * prevent closing this window by onclick
 * @param {event} event 
 */
function doNotCloseOverlay(event) {
  event.stopPropagation();
}
