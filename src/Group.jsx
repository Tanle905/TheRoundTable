import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import GroupForm from "./GroupForm";
import { useState } from "react";

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
  const groupId = groupRef.doc().id;
  groupRef.doc(groupId).set({
    groupId,
    name: groupName,
    members: [...selectedFriends, firebase.auth().currentUser.uid],
  });
  setGroupName("");
};
function Group({ groups, setGroupId, friends, setActive }) {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState(null);
  return (
    <div>
      {groups && groups.length !== 0 ? (
        <ul>
          {groups &&
            groups.map((group, index) => {
              if (group.members.includes(firebase.auth().currentUser.uid))
                return (
                  <li key={index} className="">
                    <div className="m-3 flex-col text-gray-800 dark:text-gray-300">
                      <h1
                        className="font-medium text-lg sm:text-xl cursor-pointer"
                        onClick={() => {
                          setActive(group.groupId);
                          setGroupId(group.groupId);
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
          <object
            data="src\svg\DrawKit Vector Illustration Social Work & Charity (9).svg"
            type=""
            className="mx-auto w-2/3 h-2/3"
          ></object>
          <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-200 text-center">
            You do not have any group. Let's create one!!!
          </h1>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowGroupForm(!showGroupForm);
            }}
            className="m-10 sm:mx-32 p-3 bg-blue-600 dark:bg-indigo-500 text-gray-100 rounded-lg font-semibold hover:-translate-y-1 hover:bg-blue-500 dark:hover:bg-indigo-400 hover:text-white transition"
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
