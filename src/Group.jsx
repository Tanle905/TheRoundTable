import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import GroupForm from "./GroupForm";
import { useState } from "react";
import firstTimeGroupImg from "./svg/groupImg.svg";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
  authDomain: "the-round-table-ffc3f.firebaseapp.com",
  projectId: "the-round-table-ffc3f",
  storageBucket: "the-round-table-ffc3f.appspot.com",
  messagingSenderId: "551826854387",
  appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
  measurementId: "G-3NRE8RWMTD",
});

const userRef = firebase.firestore().collection("users");
const groupRef = firebase.firestore().collection("groups");
const addGroup = (e, groupName, setGroupName, selectedFriends) => {
  e.preventDefault();
  const groupId = groupRef.doc().id;
  groupRef.doc(groupId).set({
    groupId,
    name: groupName,
    members: [...selectedFriends, firebase.auth().currentUser.uid],
  });
  selectedFriends.map((selectedFriend) => {
    userRef.doc(selectedFriend).collection("groups").doc(groupId).set({
      name: groupId,
    });
  });
  userRef
    .doc(firebase.auth().currentUser.uid)
    .collection("groups")
    .doc(groupId)
    .set({
      name: groupId,
    });
  setGroupName("");
};
function Group({ groups, setGroupId, friends, setActive, setActiveName }) {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [userGroupCollectionData] = useCollectionData(
    userRef.doc(firebase.auth().currentUser.uid).collection("groups")
  );

  return (
    <div>
      {groups &&
      groups.length !== 0 &&
      userGroupCollectionData &&
      userGroupCollectionData.length !== 0 ? (
        <ul>
          {groups &&
            groups.map((group, index) => {
              if (group.members.includes(firebase.auth().currentUser.uid))
                return (
                  <li key={index} className="">
                    <div className="m-3 flex-col text-gray-800 dark:text-gray-300">
                      <h1
                        className="cursor-pointer text-lg font-medium sm:text-xl"
                        onClick={() => {
                          setActive(group.groupId);
                          setGroupId(group.groupId);
                          setActiveName(group.name);
                        }}
                      >
                        {group.name}
                      </h1>
                    </div>
                  </li>
                );
            })}
        </ul>
      ) : (
        <div className="flex flex-col place-content-center">
          <img src={firstTimeGroupImg} className="mx-auto h-2/3 w-2/3" />
          <h1 className="px-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
            You do not have any group. Let's create one!!!
          </h1>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowGroupForm(!showGroupForm);
            }}
            className="m-10 rounded-lg bg-blue-600 p-3 font-semibold text-gray-100 transition hover:-translate-y-1 hover:bg-blue-500 hover:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 2xl:mx-32"
          >
            Add Group
          </button>
          {showGroupForm && (
            <GroupForm
              state={showGroupForm}
              setState={setShowGroupForm}
              groupName={groupName}
              setGroupName={setGroupName}
              friends={friends}
            />
          )}
        </div>
      )}
    </div>
  );
}

export { addGroup, Group };
