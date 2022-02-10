import firebase from "firebase/compat/app";
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
  return (
    <div>
      {
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
      }
    </div>
  );
}

export { addGroup, Group };
