// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNrtV3TsMljkJHtst2aX87IeZOcQyNQ9A",
  authDomain: "stock-market-ce23e.firebaseapp.com",
  projectId: "stock-market-ce23e",
  storageBucket: "stock-market-ce23e.appspot.com",
  messagingSenderId: "996301529064",
  appId: "1:996301529064:web:e2409079602e8733714e5d",
  measurementId: "G-QMLTZ4S849"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
  // Sign Up form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      register();
    });
  }

  // Sign In form
  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      login();
    });
  }

  // Google Sign-In button
  const googleSignInBtn = document.getElementById('googleSignIn');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', function(e) {
      e.preventDefault();
      googleSignIn();
    });
  }
});

// Set up our register function
function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const fullName = document.getElementById('fullName').value;
  const favourite_song = document.getElementById('favourite_song').value;
  const milk_before_cereal = document.getElementById('milk_before_cereal').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is Outta Line!!');
    return;
  }
  if (!validate_field(fullName) || !validate_field(favourite_song) || !validate_field(milk_before_cereal)) {
    alert('One or More Extra Fields is Outta Line!!');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, { displayName: fullName })
        .then(() => user);
    })
    .then((user) => {
      // Add this user to Firebase Database
      const user_data = {
        email: email,
        full_name: fullName,
        favourite_song: favourite_song,
        milk_before_cereal: milk_before_cereal,
        last_login: Date.now()
      };
      return set(ref(database, 'users/' + user.uid), user_data);
    })
    .then(() => {
      console.log("User account created & signed in!");
      alert('User Created!!');
      window.location.href = '/pages/home.html';
    })
    .catch((error) => {
      console.error("Error: ", error);
      alert(error.message);
    });
}

// Set up our login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is Outta Line!!');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const user_data = {
        last_login: Date.now()
      };
      return update(ref(database, 'users/' + user.uid), user_data);
    })
    .then(() => {
      alert('User Logged In!!');
      window.location.href = '/pages/home.html';
    })
    .catch((error) => {
      console.error("Sign-In Error", error);
      alert(error.message);
    });
}

// Google Sign-In function
function googleSignIn() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('Google Sign-In Successful', result.user);
      window.location.href = '/pages/home.html';
    }).catch((error) => {
      console.error('Google Sign-In Error', error.code, error.message);
      alert('Failed to sign in with Google. Error: ' + error.message);
    });
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}
