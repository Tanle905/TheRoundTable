import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";

function Friends({ msg }) {
  const userRef = firebase.firestore().collection("users");
  const userFriendRef = user
    ? userRef.doc(user.uid).collection("friends")
    : null;
  const [userFriendsCollectionData] = useCollectionData(userFriendRef);
  //check for better solution
  const [activeFriend, setActiveFriend] = useState([""]);
  const [activeFriendName, setActiveFriendName] = useState([""]);
  const [uidValue, setUidValue] = useState("");
  const addfriend = (event) => {
    if (!usersDataLoading && userRef) {
      usersCollectionData.forEach((element) => {
        if (element.uid === uidValue) {
          userFriendRef.doc(uidValue).set({
            friendEmail: element.email,
            friendName: element.name,
            friendUid: element.uid,
            friendphotoURL: element.photoURL,
          });
          userRef.doc(uidValue).collection("friends").doc(user.uid).set({
            friendEmail: user.email,
            friendName: user.displayName,
            friendUid: user.uid,
            friendphotoURL: user.photoURL,
          });
        }
      });
      setUidValue("");
    }
  };
  useEffect(() => {
    setActiveFriend(
      userFriendsCollectionData != null &&
        userFriendsCollectionData.length != 0 &&
        userFriendsCollectionData[0].friendUid
    );
    setActiveFriendName(
      userFriendsCollectionData != null &&
        userFriendsCollectionData.length != 0 &&
        userFriendsCollectionData[0].friendName
    );
  }, [userFriendsCollectionData]);
  const FriendsList = React.memo(function FriendsList(props) {
    const { friendUid, friendName, friendphotoURL } = props.friends;
    const friendClass =
      friendUid === activeFriend ? "friend-active" : "friend-inactive";
    const friendRefHandle = () => {
      setActiveFriend(friendUid);
      setActiveFriendName(friendName);
    };

    const filteredMessages =
      friendUid &&
      props.msg &&
      props.msg.filter((message) => {
        if (
          (friendUid === message.sendTo &&
            auth.currentUser.uid === message.sentFrom) ||
          (friendUid === message.sentFrom &&
            auth.currentUser.uid === message.sendTo)
        )
          return message;
      });
    return (
      <li
        className={`group transition ${friendClass} `}
        onClick={friendRefHandle}
      >
        <div className="p-3 space-x-5 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
          <img
            className="w-16 max-h-16 rounded-full transition group-hover:ring-4 ring-blue-500 dark:ring-indigo-400"
            src={friendphotoURL}
            alt=""
          />
          <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-300">
            <h1 className="font-medium text-xl">{friendName}</h1>
            <p className="truncate flex">
              <span className="mr-2">
                {filteredMessages && filteredMessages.length !== 0
                  ? filteredMessages[filteredMessages.length - 1].uid ===
                    friendUid
                    ? ""
                    : "Bạn: "
                  : ""}
              </span>
              {filteredMessages &&
              filteredMessages.length !== 0 &&
              filteredMessages[filteredMessages.length - 1].text
                ? filteredMessages[filteredMessages.length - 1].text
                : "đã gửi 1 ảnh"}
            </p>
          </div>
          <div className="col-span-1 mr-auto dark:text-gray-200 text-gray-700">
            <p></p>
          </div>
        </div>
      </li>
    );
  });
  return (
    <React.Fragment>
      <div className="p-4 py-1 flex border-b-2 border-gray-200 dark:border-slate-800">
        <h1 className="font-bold my-auto text-gray-800 dark:text-gray-200 text-2xl">
          Chats
        </h1>
        <div className="py-3 my-auto ml-auto sm:mr-5 relative group">
          <input
            className="h-10 pr-10 w-10 ml-2 bg-gray-50 group-hover:bg-gray-200 dark:group-hover:bg-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 sm:group-hover:w-36 xl:group-hover:w-56 focus:border-0 focus:ring-0 form-input"
            type="search"
            name="search"
            placeholder="Search for Friends..."
          />
          <button className="absolute right-2 top-0 mt-5 text-gray-600 dark:text-gray-50 transition-all hover:text-gray-800 dark:hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <form className="py-3 my-auto relative group" onSubmit={addfriend}>
          <input
            className="h-10 pr-10 w-10 ml-2 bg-gray-50 group-hover:bg-gray-200 dark:group-hover:bg-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 sm:group-hover:w-36 xl:group-hover:w-56 focus:border-0 focus:ring-0 form-input"
            type="text"
            placeholder="Add a Friend UID"
            value={uidValue}
            onChange={(e) => setUidValue(e.target.value)}
          />
          <button
            className="absolute right-2 top-0 mt-5 text-gray-600 dark:text-gray-50 transition-all group-hover:rotate-180"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
      <ul className="space-y-3">
        {userFriendsCollectionData &&
          userFriendsCollectionData.map((element, index) => (
            <FriendsList friends={element} key={index} msg={msg} />
          ))}
      </ul>
    </React.Fragment>
  );
}
export { activeFriend, Friends, activeFriendName };
