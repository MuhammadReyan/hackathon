import { auth, db, onAuthStateChanged, getDoc, doc, collection, getDocs, orderBy, query, where } from "../fireConfig.js";






const storedUser = JSON.parse(localStorage.getItem('user'));
const { user, userAuthor } = storedUser

const blogContainer = document.querySelector('.blogContainer');
getPost(user, userAuthor)

async function getPost(postId, uid) {
    try {
        blogContainer.innerHTML = '';
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const { authorId, postTitle, postDescription, time } = docSnap.data()


            const gettingUserData = await getAuthData(uid)






            let div = document.createElement('div');
            div.setAttribute('class', 'postConatiner postInputContainer my-3');
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
        };
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