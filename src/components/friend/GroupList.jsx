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

const addGroup = (
  event,
  groupRef,
  groupName,
  setGroupName,
  selectedFriends,
  friendsDatas
) => {
  event.preventDefault();
  const groupId = groupRef.doc().id;
  if (groupName != "" && selectedFriends.length !== 1) {
    const filteredFriendsDatas = friendsDatas.filter((friendsData) => {
      if (selectedFriends.includes(friendsData.friendUid)) return friendsData;
    });
    groupRef.doc(groupId).set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      groupId,
      name: groupName,
      members: [...selectedFriends, firebase.auth().currentUser.uid],
      friendsData: filteredFriendsDatas,
    });
    setGroupName("");
  } else alert("Please input a valid name or friend");
};
function Group({ group, activeGroup, setGroupId, setActive, setActiveName }) {
  const groupClass =
    group !== undefined && group.groupId === activeGroup
      ? "group-active"
      : "group-inactive";
  if (
    group &&
    group.members !== undefined &&
    group.members.includes(firebase.auth().currentUser.uid)
  )
    return (
      <li>
        <div
          className={`${groupClass} flex-col p-3 text-gray-800 dark:text-gray-300`}
          onClick={() => {
            setActive(group.groupId);
            setGroupId(group.groupId);
            setActiveName(group.name);
          }}
        >
          <h1 className="cursor-pointer text-lg font-medium sm:text-xl">
            {group.name}
          </h1>
        </div>
      </li>
    );
  else return "";
}

export { addGroup, Group };
