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

const groupRef = firebase.firestore().collection("groups");
const addGroup = (e, groupName, setGroupName, selectedFriends) => {
  e.preventDefault();
  console.log(groupName);
  groupRef.doc(groupName).set({
    name: groupName,
    user: [...selectedFriends, firebase.auth().currentUser.uid],
  });
  setGroupName("");
};
function Group({ groups }) {
  return (
    <ul>
      {groups &&
        groups.map((group, index) => {
          return (
            <li key={index} className="">
              <div className="m-3 flex-col text-gray-800 dark:text-gray-300">
                <h1 className="font-medium text-lg sm:text-xl cursor-pointer">{group.name}</h1>
              
              </div>
            </li>
          );
        })}
    </ul>
  );
}

export { addGroup, Group };
