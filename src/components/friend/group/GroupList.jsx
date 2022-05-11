import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import moment from "moment";

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

function Group({
  group,
  activeGroup,
  setGroupId,
  setActive,
  setActiveName,
  messages,
}) {
  const { groupId, friendsData, members, name } = group;
  const groupClass =
    group !== undefined && groupId === activeGroup
      ? "group-active"
      : "group-inactive";

  const filteredMessages =
    group.groupId &&
    messages &&
    messages.filter((message) => {
      if (groupId === message.sendTo) return message;
    });
  const latestMessages =
    filteredMessages != null &&
    filteredMessages.length !== 0 &&
    filteredMessages[filteredMessages.length - 1].createdAt != null &&
    filteredMessages[filteredMessages.length - 1].createdAt.toDate();
  if (
    group &&
    members !== undefined &&
    members.includes(firebase.auth().currentUser.uid)
  )
    return (
      <li
        className={`cursor-pointer px-3 ${groupClass}`}
        onClick={() => {
          setActive(groupId);
          setGroupId(groupId);
          setActiveName(name);
        }}
      >
        <div className="grid grid-cols-10 space-x-2 rounded-lg p-2 transition-all hover:cursor-pointer focus:bg-gray-200">
          <div className="relative mt-1">
            <img
              className="absolute right-3 bottom-2 max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
              src={friendsData[0].friendphotoURL}
              alt=""
            />
            <img
              className="absolute left-1 max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
              src={friendsData[1].friendphotoURL}
              alt=""
            />
          </div>
          <div className="col-span-7 flex-col text-gray-800 dark:text-gray-300">
            <h1 className="truncate text-sm font-medium sm:text-lg">{name}</h1>
            <div className="flex text-xs">
              {filteredMessages &&
              filteredMessages.length !== 0 &&
              !filteredMessages[filteredMessages.length - 1].deleted &&
              filteredMessages[filteredMessages.length - 1].text ? (
                <p className="truncate text-ellipsis">
                  {filteredMessages[filteredMessages.length - 1].text}
                </p>
              ) : filteredMessages &&
                filteredMessages.length !== 0 &&
                !filteredMessages[filteredMessages.length - 1].deleted ? (
                filteredMessages &&
                filteredMessages.length !== 0 &&
                "sent a file"
              ) : filteredMessages &&
                filteredMessages.length !== 0 &&
                filteredMessages[filteredMessages.length - 1].deleted ? (
                "deleted a message"
              ) : (
                "No message recently"
              )}
            </div>
          </div>
          <div className="col-span-2 mr-auto text-gray-700 dark:text-gray-200">
            <p className="line-clamp-2 text-xs">
              {filteredMessages &&
                filteredMessages.length !== 0 &&
                moment(latestMessages)
                  .startOf("minute")
                  .fromNow()
                  .slice(
                    0,
                    moment(latestMessages)
                      .startOf("minute")
                      .fromNow()
                      .indexOf(" ", 3)
                  )}
            </p>
          </div>
        </div>
      </li>
    );
  else return "";
}

export { addGroup, Group };
