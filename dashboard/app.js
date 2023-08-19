// // FireBase

import {
    auth,
    db,
    doc,
    getDoc,
    onAuthStateChanged,
    signOut,
    setDoc,
    addDoc,
    collection,
    getDocs,
    getAuth,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    updateDoc,
    deleteDoc,
    app,
    orderBy,
    serverTimestamp,
    query,
    where

} from '../fireConfig.js'


// CLASSES AND IDS VARIABLES
const curentUser = document.querySelector('.curentUser')
const postContainer = document.querySelector('.post-container')
console.log(postContainer)
const dashBoardpp = document.querySelector('.pp')
const postBtn = document.getElementById('postBtn')
const postInput = document.querySelector('.postInput')
const inputDescription = document.querySelector('.Description')






// VARIABLES
let currentLoggedInUser;
let ppLogInProfile;
let globalId;
let editLogic = false
editLogic ? postBtn.innerText = 'Update' : postBtn.innerText = 'Post'


// Event Listener
postBtn.addEventListener('click', postHandler)




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

        swal("success", "signout successfully", "success")



        window.location.href = '../login and signup/index.html'

    }).catch((error) => {
        // An error happened.
    });

}
logOut.addEventListener('click', logoutHandler)


// CURRENT USER

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid)

        getUserData(uid)
        currentLoggedInUser = uid
        getPosts(uid)
        // ...
    } else {
        // User is signed out
        // ...
        console.log("sign out")
        window.location.href = './index.html'
    }
});

// Getting DATA


async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            const { lastName, signUpEmail, firstName, profilePicture } = docSnap.data()
            ppLogInProfile = profilePicture
            // userNameHTML.textContent = surName
            // emailAddressHTML.textContent = signUpEmail
            // mobNumHTML.textContent = phoneNumber
            // firstName.textContent = firstName
            curentUser.innerHTML = firstName, lastName

            dashBoardpp.src = profilePicture || '/assets/pp.jpg'


        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error, "==>>error in get User Data")
    }
}





async function postHandler() {
    confirm("Data Post");

    let currentTime = new Date()

    console.log(currentTime);

    const title = postInput.value;
    const description = inputDescription.value;


    if (title && description) {
        savePostData(title, description, null);
    } else {
        alert("Please provide both title and description.");
    }
}

async function savePostData(title, description,) {
    try {
        const response = await addDoc(collection(db, "posts"), {
            postTitle: title,
            postDescription: description,

            authorId: currentLoggedInUser,
            time: serverTimestamp()
        });

        getPosts(currentLoggedInUser);
        console.log(currentLoggedInUser)


        postInput.value = ""; // Clear the title input
        inputDescription.value = ""; // Clear the description input


        let modal = document.getElementById('exampleModal');
        let modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        location.reload()
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


// Get Post

async function getPosts(currentId) {
    console.log(currentId)
    console.log(postContainer)
    // postContainer.innerHTML = ''


    const postsCollectionRef = collection(db, "posts");

    // Create a query to order the documents by "time" field in descending order
    // const sortedQuery = query(postsCollectionRef, orderBy("time", "asc"),where("authorId", "==", currentId)); // "desc">

    const sortedQuery = query(collection(db, "posts"), where("authorId", "==", currentId))

    // if (!currentLoggedInUser) {
    //     console.error("currentLoggedInUser is undefined.");
    //     return;
    // }

    // const sortedQuery = query(collection(db, "posts"));

    // Fetch the documents based on the sorted query
    const querySnapshot = await getDocs(sortedQuery);

    querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        let postId = doc.id
        const { authorId, postTitle, postDescription, time } = doc.data()
        console.log(doc.data())


        const authorDetails = await getAuthorData(authorId)
        const postElement = document.createElement('div')
        postElement.setAttribute('class', 'box')
        const content = ` <div class="post-row">
        <div class="user-profile">
            <img src=${authorDetails.profilePicture || '/assets/pp.jpg'} alt="">
            <div>
                <p>${authorDetails?.firstName}</p>
                <span>${new Date(time.seconds * 1000)}</span>
            </div>
        </div>

        ${authorId === currentLoggedInUser ? `

     <div class="dropdown">
     <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
     </button>
     <ul class="dropdown-menu">
       <li><a class="dropdown-item" href="#"    onclick="editPostHandler('${postId}')"       >Edit</a></li>
       <li><a class="dropdown-item" href="#"              onclick="deletePostHandler('${postId}')"         >Delete</a></li>
     </ul>
   </div>

  ` : ''
            }


    </div >
    
    <p class="post-text">
       ${postTitle}
    </p>
    <div class="post-img"> ${postDescription} </div>

    <div class="post-row">
        <div class="activity-icons">
            <div><img src="/assets/like-blue.png" alt="">100</div>
            <div><img src="/assets/comments.png" alt="">90</div>
            <div><img src="/assets/share.png" alt="">15</div>
        </div>
        <div class="post-profile-icon">
            <img src=${ppLogInProfile || '/assets/pp.jpg'} alt="">
            <i class="fas fa-caret-down"></i>
        </div>
    </div> `




        postElement.innerHTML = content

        postContainer.appendChild(postElement)



    });

}


// Update Function

async function updatePostHandler() {
    confirm("Data Post");

    try {
        const washingtonRef = doc(db, "posts", globalId);
        const response = await updateDoc(washingtonRef, {
            postContent: postInput.value,
            postDescription: inputDescription.value,
            authorId: currentLoggedInUser,
        });

        let modal = document.getElementById('exampleModal');
        let modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        swal("success", "update", "success")
        getPosts(globalId);
        location.reload()

    } catch (e) {
        console.error("Error updating document: ", e);
    }
}



// EDIT FUNCTION

function editPostHandler(postId) {

    editLogic = true
    postBtn.innerText = "Update"
    postBtn.removeEventListener('click', postHandler)
    postBtn.addEventListener('click', updatePostHandler)
    globalId = postId
    let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();


}
// Delete Post 

async function deletePostHandler(postId) {
    let confirmBox = confirm("Are you Sure Delete Your Post ?")

    if (confirmBox === true) {

        await deleteDoc(doc(db, "posts", postId));
        swal("success", "Your Post Successfully Deleted", "success")
        setTimeout(() => {
            getPosts()
            location.reload()
        }, 2000)

    }
}
window.deletePostHandler = deletePostHandler
window.editPostHandler = editPostHandler





























































// Getting Author Data



async function getAuthorData(authorUid) {
    try {

        const docRef = doc(db, "users", authorUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error)
    }
}
