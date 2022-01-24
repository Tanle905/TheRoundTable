import "./App.css";
import Header from "./Header";
import Message from "./Message";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import SignIn from "./SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
  authDomain: "the-round-table-ffc3f.firebaseapp.com",
  projectId: "the-round-table-ffc3f",
  storageBucket: "the-round-table-ffc3f.appspot.com",
  messagingSenderId: "551826854387",
  appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
  measurementId: "G-3NRE8RWMTD",
});

const App = () => {
  const auth = firebase.auth();
  const [user, authLoading] = useAuthState(auth);
  const userRef = firebase.firestore().collection("users");

  const addUser = () => {
    if (!authLoading) {
      userRef.doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
      })
    }
  };

  let someThing;
  if (user && !authLoading) {
    addUser();
    someThing = (
      <div className="">
        <Header />
        <Message />
      </div>
    );
  } else if (!user && !authLoading) {
    someThing = <SignIn />;
  } else {
    someThing = <div></div>;
  }

  return <div>{someThing}</div>;
};

export { App, firebaseApp };
