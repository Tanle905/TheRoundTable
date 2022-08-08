import Header from "./Header";
import Message from "./Message";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Loading from "./animation/Loading";
import React, { useEffect } from "react";
import SignIn from "./auth/SignIn";
import { useState } from "react";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
  authDomain: "the-round-table-ffc3f.firebaseapp.com",
  projectId: "the-round-table-ffc3f",
  storageBucket: "the-round-table-ffc3f.appspot.com",
  messagingSenderId: "551826854387",
  appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
  measurementId: "G-3NRE8RWMTD",
});

const AuthContext = React.createContext();

const App = () => {
  const isSystemDarkTheme =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
  const auth = firebase.auth();
  const [user, authLoading] = useAuthState(auth);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const userRef = firebase.firestore().collection("users");
  const userDocRef =
    user && firebase.firestore().collection("users").doc(user.uid);
  const [usersCollectionData] = useCollectionData(userRef);
  const [userDocumentData, userDocumentDataIsLoading] =
    useDocumentData(userDocRef);
  let content;

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem(
        "theme",
        JSON.stringify({
          isDarkTheme: isSystemDarkTheme,
          isUsingSystemTheme: true,
        })
      );
      setTheme({ isDarkTheme: isSystemDarkTheme, isUsingSystemTheme: true });
    }
  }, []);

  function addUser() {
    if (!authLoading) {
      userRef.doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
      });
    }
  }

  if (authLoading) {
    content = <Loading />;
  } else if (!user) {
    content = <SignIn />;
  } else {
    if (
      !userDocumentDataIsLoading &&
      !userDocumentData &&
      !usersCollectionData
        ?.map((user) => user.uid)
        .includes(auth.currentUser.uid)
    ) {
      addUser();
    }
    if (!userDocumentData?.banned) {
      content = (
        <div className="h-screen overflow-hidden">
          <AuthContext.Provider value={{ auth, user }}>
            <Header setTheme={setTheme} />
            <Message />
          </AuthContext.Provider>
        </div>
      );
    } else {
      alert("You have been banned. Please contact admin for more info.");
      auth.signOut();
      content = <SignIn />;
    }
  }
  return (
    <AuthContext.Provider value={{ auth, user }}>
      <div className={`${theme?.isDarkTheme ? "dark" : "light"}`}>{content}</div>
    </AuthContext.Provider>
  );
};

export { App, firebaseApp, AuthContext };
