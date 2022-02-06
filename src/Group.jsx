import firebase from "firebase/compat/app";
import { doc } from "firebase/firestore";
import "firebase/compat/auth";


firebase.initializeApp({
    apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
    authDomain: "the-round-table-ffc3f.firebaseapp.com",
    projectId: "the-round-table-ffc3f",
    storageBucket: "the-round-table-ffc3f.appspot.com",
    messagingSenderId: "551826854387",
    appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
    measurementId: "G-3NRE8RWMTD",
});

const userRef = firebase.firestore().collection('users')
const groupRef = firebase.firestore().collection('groups')
const addGroup = (e, groupName, setGroupName, selectedFriends) => {
    e.preventDefault()
    console.log(groupName)
    groupRef.doc(groupName).set({
        name: groupName,
        user: [...selectedFriends, firebase.auth().currentUser.uid]
    })
    setGroupName('')
}
function Group() {
    return (
        <div></div>
    )
}

export { addGroup, Group }