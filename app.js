import { auth, db, onAuthStateChanged, getDoc, doc, collection, getDocs, orderBy, query } from "./fireConfig.js";
// import moment from "moment"; // Make sure you've imported moment correctly.

const blogContainer = document.querySelector('.blogContainer');



let currentLoggedInUser
let ppLogInProfile;
const curentUser = document.querySelector('.username')

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getUserData(uid);
        currentLoggedInUser = uid;
    } else {
        console.log("User is signed out");

    }
});

async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { surName, signUpEmail, phoneNumber, firstName, profilePicture } = docSnap.data();
            ppLogInProfile = profilePicture || './assets/pp.jpg';
            // curentUser.innerHTML = firstName;
            // dashBoardpp.src = profilePicture || '../assets/pp.jpg';
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error in getUserData:", error);
    }
}

async function getPost() {
    try {
        blogContainer.innerHTML = '';
        const postsCollectionRef = collection(db, "posts");
        const sortedQuery = query(postsCollectionRef, orderBy("time", "asc"));
        const querySnapshot = await getDocs(sortedQuery);

        querySnapshot.forEach(async (doc) => {
            let postId = doc.id;
            const { authorId, postTitle, postDescription, time } = doc.data();

            const gettingUserData = await getAuthData(authorId);

            let div = document.createElement('div');
            div.setAttribute('class', 'postConatiner postInputContainer my-3');
            div.setAttribute('onclick', `seeUserPoster('${postId}','${authorId}')`);
            div.innerHTML = `<div class="d-flex justify-content-between ">
            <div class="authorsDetails d-flex align-items-center">
                <div class="post-header-container d-flex align-items-center">
                    <div class="image">
                        <img  src=${gettingUserData?.profilePicture || "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1685543404~exp=1685544004~hmac=d07ea3ce3ef8f3935685c31c8166ad233839e12607dfb08424f2e5a129f3d691"}
                            alt="" class="img-fluid rounded mx-auto d-block">
                    </div>
                    <div class="userName-id ms-2">
                        <h4 class="mb-1 blogTitle" style="color: #868686;">
                            ${postTitle}</h4>
                        <div class="d-flex align-items-center justify-content-center">
                            <h6 class="mb-1 username">${gettingUserData.firstName}</h6>
                            <h6 class="mb-0 ms-2">${moment(time.toDate()).fromNow()}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="blogDetails">
            <p id="post-text" class="mt-2">${postDescription}</p>
        </div>`;
            blogContainer.prepend(div);
        });
    } catch (error) {
        console.error("Error in createPost:", error);
    }
}

async function getAuthData(id) {
    try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User Data:", userData);
            return userData;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error in getAuthData:", error);
    }
}

// Call createPost to retrieve and display blog posts
getPost();








function seeUserPoster(userId, postId) {



    const user = { user: userId, userAuthor: postId };

    localStorage.setItem('user', JSON.stringify(user))

    window.location.href = './seeuser/see.html'
    // console.log(data, cc)

}

window.seeUserPoster = seeUserPoster




