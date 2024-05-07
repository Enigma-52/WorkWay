import { GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getAuth , signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';

let firebaseConfig;
fetch('/firebase-config')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        firebaseConfig = data.firebaseConfig;
        console.log(firebaseConfig);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

async function handleGoogle() {
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    console.log("hi");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("USER SIGNED IN -> " + user.uid);

    const requestBody = {
        userId: user.uid,
        email: user.email // Include the user's email
    };


    const response = await fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    window.location.href = '/search.html';
}

export { handleGoogle };