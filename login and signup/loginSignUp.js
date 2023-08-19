
import { auth, app, db, getFirestore, collection, addDoc, setDoc, doc, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../fireConfig.js'

const firstName = document.querySelector('.firstName')
const lastName = document.querySelector('.lastName')
const signUpEmail = document.querySelector('.signupemail')
const signUpPassword = document.querySelector('.signUpPassword')
const newPassword = document.querySelector('.newPassword')

// Login Input Get

const loginEmail = document.querySelector('.loginEmail')
const loginPassword = document.querySelector('.loginPassword')



// Signup Handler get  and put function

const signUpBtn = document.querySelector('#signup')

// Login Handler function and get 

const loginBtn = document.querySelector('#login')


// User Creating Account 

async function signUpHandler() {


    if ((firstName.value.length < 3) || (lastName.value.length < 1)) {

        swal("Oops", "first name should be atleast 4 character & last name should be atleast 1 character", "error")
        return

    }



    console.log(signUpEmail.value)
    console.log(signUpPassword.value)
    try {
        let response = await createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value)

        console.log(response)
        if (response.user.uid) {
            addUserHandler(response.user.uid)
            let modal = document.getElementById('exampleModal');
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }


    } catch (error) {
        console.error(error)
    }

}

signUpBtn.addEventListener('click', signUpHandler)




// User  Login Function 


function loginHandler() {


    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if (user) {
                swal("success", "user login", "success")
                window.location.href = '../dashboard/index.html'
            }
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage)
        });
}

loginBtn.addEventListener('click', loginHandler)




async function addUserHandler(uid) {

    try {
        let response = await setDoc(doc(db, "users", uid), {

            firstName: firstName.value,
            lastName: lastName.value,
            signUpPassword: signUpPassword.value,
            signUpEmail: signUpEmail.value,
        });
        // console.log(response)
        window.location.href = 'index.html'
    } catch (error) {
        console.error(error)
    }
}

