import Header from "./Header";
import Message from "./Message";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import SignIn from "./SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

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
  const userDocRef =
    user && firebase.firestore().collection("users").doc(user.uid);
  const [userDocumentData, userDocumentDataIsLoading] =
    useDocumentData(userDocRef);
  const addUser = () => {
    if (!authLoading) {
      userRef.doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
      });
    }
  };

  let content;
  if (!authLoading && user && !userDocumentDataIsLoading) {
    if (
      userDocumentData !== undefined &&
      !userDocumentData.banned
    ) {
      content = (
        <div className="h-screen overflow-hidden">
          <Header />
          <Message />
        </div>
      );
    } else if (
      userDocumentData !== undefined &&
      userDocumentData.banned
    ) {
      alert("you have been banned");
      auth.signOut();
      content = <SignIn />;
    } else if (!userDocumentDataIsLoading && userDocumentData === undefined) {
      addUser();
    }
  } else if (!user && !authLoading) {
    content = <SignIn />;
  } else {
    content = (
      <div className="flex h-screen place-content-center bg-gray-50 dark:bg-slate-900">
        <div className="my-auto h-24 w-24 animate-bounce rounded-lg bg-blue-500 shadow-2xl dark:bg-indigo-500 dark:shadow-indigo-800/75"></div>
      </div>
    );
  }
  return <div>{content}</div>;
};

export { App, firebaseApp };
