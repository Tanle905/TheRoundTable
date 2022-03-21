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
const addGroup = (
  e,
  groupName,
  setGroupName,
  selectedFriends,
  friendsDatas
) => {
  e.preventDefault();
  const groupId = groupRef.doc().id;
  if (groupName != "" && selectedFriends.length !== 1) {
    const filteredFriendsDatas = friendsDatas.filter((friendsData) => {
      if (selectedFriends.includes(friendsData.friendUid)) return friendsData;
    });
    groupRef.doc(groupId).set({
      groupId,
      name: groupName,
      members: [...selectedFriends, firebase.auth().currentUser.uid],
      friendsData: filteredFriendsDatas,
    });
    selectedFriends.map((selectedFriend) => {
      userRef.doc(selectedFriend).collection("groups").doc(groupId).set({
        name: groupId,
      });
    });
    setGroupName("");
  } else alert("Please input a valid name or friend");
};
function Group({ groups, activeGroup, setGroupId, setActive, setActiveName }) {
  return (
    <div className="max-h-[35vh] overflow-auto">
      {
        <ul>
          {groups &&
            groups.map((group, index) => {
              const groupClass =
                group.groupId === activeGroup
                  ? "group-active"
                  : "group-inactive";
              if (group.members.includes(firebase.auth().currentUser.uid))
                return (
                  <li key={index}>
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
            })}
        </ul>
      }
    </div>
  );
}

export { addGroup, Group };
