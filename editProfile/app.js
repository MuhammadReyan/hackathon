

import {
    auth, EmailAuthProvider, reauthenticateWithCredential, updatePassword,

    signOut,

    getAuth,


} from "../fireConfig.js";

const OldPassword = document.querySelector('#OldPassword');
const NewPassword = document.querySelector('#NewPassword');
const editButtonhai = document.querySelector('#editButtonhai');

// Function to change the user's password
async function changePassword() {
    const oldPasswordValue = OldPassword.value; // Get the value of the old password input
    const newPasswordValue = NewPassword.value; // Get the value of the new password input

    try {
        // Reauthenticate the user with their old password
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, oldPasswordValue);
        await reauthenticateWithCredential(user, credential);

        // If reauthentication is successful, update the password
        await updatePassword(user, newPasswordValue);

        console.log("Password updated successfully.");
        swal("sucess", "Password updated successfully", "sucess")
        location.reload()
    } catch (error) {
        console.error("Error changing password:", error);
    }
}

editButtonhai.addEventListener('click', changePassword);









// Display Logout button

const signOutBtn = document.getElementById('signOut')
const logOut = document.getElementById('logOut')

function displayShow() {
    let settingMenu = document.querySelector('.setting-menu')
    settingMenu.classList.toggle('setting-menu-height')
}

signOutBtn.addEventListener('click', displayShow)

const logoutHandler = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("signout successfully")
        window.location.href = '../login and signup/index.html'
    }).catch((error) => {
        // An error happened.
    });

}
logOut.addEventListener('click', logoutHandler)



