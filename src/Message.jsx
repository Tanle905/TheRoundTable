import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import SlideOver from "./SlideOver";
import SlideOver2 from "./SlideOver2";
import GroupForm from "./GroupForm";
import { Group } from "./Group";
import firstTimeGroupImg from "./svg/teammeeting.svg";
import friendSvg from "./svg/groupImg.svg";

const Message = React.memo(() => {
  /*Init and Variables Section*/
  //Firebase init
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
    authDomain: "the-round-table-ffc3f.firebaseapp.com",
    projectId: "the-round-table-ffc3f",
    storageBucket: "the-round-table-ffc3f.appspot.com",
    messagingSenderId: "551826854387",
    appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
    measurementId: "G-3NRE8RWMTD",
  });

  //Users init and variables
  const auth = firebase.auth();
  const [user] = useAuthState(auth);
  const userRef = firebase.firestore().collection("users");
  const [usersCollectionData, usersDataLoading] = useCollectionData(userRef);

  //fileHandle init and variables
  const storage = getStorage(firebaseApp);
  const [showFile, setShowFile] = useState(false);

  //Friends init and variable
  const [uidValue, setUidValue] = useState("");
  const [showFriendList, setShowFriendList] = useState(false);
  const userFriendRef = user
    ? userRef.doc(user.uid).collection("friends")
    : null;
  const [userFriendsCollectionData, userFriendsCollectionDataIsLoading] =
    useCollectionData(userFriendRef);
  const [activeFriend, setActiveFriend] = useState([""]);
  const [activeName, setActiveName] = useState([""]);

  // Messages init and variables
  const messagesRef = firebase.firestore().collection("messages");
  const [messageValue, setMessageValue] = useState("");
  const messagesQuery = messagesRef.orderBy("createdAt").limit(50);
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  /*END OF Init and Variables Section*/

  //Group init and variables
  const groupRef = firebase.firestore().collection("groups");
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupsCollectionData] = useCollectionData(groupRef);
  const [userGroupCollectionData, userGroupCollectionDataIsLoading] =
    useCollectionData(
      userRef.doc(firebase.auth().currentUser.uid).collection("groups")
    );
  //End of group init and variables

  /*Component Section*/
  //Friends Section ( FriendsList and addFriend)
  useEffect(() => {
    setActiveFriend(
      userFriendsCollectionData != null &&
        userFriendsCollectionData.length != 0 &&
        userFriendsCollectionData[0].friendUid
    );
    setActiveName(
      userFriendsCollectionData != null &&
        userFriendsCollectionData.length != 0 &&
        userFriendsCollectionData[0].friendName
    );
  }, [userFriendsCollectionData]);
  const addfriend = (event) => {
    event.preventDefault();
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
  function Friends({ msg }) {
    const FriendsList = React.memo(function FriendsList(props) {
      const { friendUid, friendName, friendphotoURL } = props.friends;
      const friendClass =
        friendUid === activeFriend ? "friend-active" : "friend-inactive";
      const friendRefHandle = () => {
        setActiveFriend(friendUid);
        setActiveName(friendName);
        setGroupId(null);
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
      const latestMessages =
        filteredMessages != null &&
        filteredMessages.length !== 0 &&
        filteredMessages[filteredMessages.length - 1].createdAt != null &&
        filteredMessages[filteredMessages.length - 1].createdAt.toDate();
      return (
        <li
          className={`group transition ${friendClass} `}
          onClick={friendRefHandle}
        >
          <div className="grid grid-cols-10 space-x-2 rounded-lg p-2 transition-all hover:cursor-pointer focus:bg-gray-200">
            <img
              className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
              src={friendphotoURL}
              alt=""
            />
            <div className="col-span-7 flex-col truncate text-gray-800 dark:text-gray-300">
              <h1 className="text-sm font-medium sm:text-lg">{friendName}</h1>
              <p className="flex text-xs">
                <span className="mr-2 ">
                  {filteredMessages && filteredMessages.length !== 0
                    ? filteredMessages[filteredMessages.length - 1].uid ===
                      friendUid
                      ? ""
                      : "You:"
                    : ""}
                </span>
                {filteredMessages &&
                filteredMessages.length !== 0 &&
                filteredMessages[filteredMessages.length - 1].text
                  ? filteredMessages[filteredMessages.length - 1].text
                  : filteredMessages &&
                    filteredMessages.length !== 0 &&
                    "sent an image"}
              </p>
            </div>
            <div className="col-span-2 mr-auto text-gray-700 dark:text-gray-200">
              <p className="line-clamp-2 text-xs">
                {filteredMessages &&
                  filteredMessages.length !== 0 &&
                  moment(latestMessages).startOf("minute").fromNow()}
              </p>
            </div>
          </div>
        </li>
      );
    });
    return (
      <div>
        <div className="grid grid-rows-3">
          <ul className="row-span-1 flex h-[33vh] flex-col overflow-auto">
            <p
              className="my-1 cursor-pointer place-self-center rounded-xl bg-blue-200 p-1 text-gray-800 transition hover:bg-slate-500 dark:bg-slate-700 dark:text-gray-200"
              onClick={() => {
                navigator.clipboard.writeText(auth.currentUser.uid);
              }}
            >
              <span className="font-semibold">UID:</span> {auth.currentUser.uid}
            </p>
            {userFriendsCollectionData &&
            userFriendsCollectionData.length !== 0 ? (
              userFriendsCollectionData.map((element, index) => (
                <FriendsList friends={element} key={index} msg={msg} />
              ))
            ) : userFriendsCollectionDataIsLoading ? (
              <div className="flex h-[30vh] place-content-center bg-gray-50 dark:bg-slate-900">
                <div className="my-auto h-24 w-24 animate-bounce rounded-full bg-blue-500 shadow-2xl dark:bg-indigo-500 dark:shadow-indigo-800/75"></div>
              </div>
            ) : (
              <div className="flex flex-col place-content-center">
                <img src={friendSvg} className="mx-auto h-2/3 w-2/3" />
                <h1 className="px-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                  You do not have any friend. Let's make some!!!
                </h1>
              </div>
            )}
          </ul>
          <div className="row-span-2 max-w-xs sm:max-w-none">
            <div className=" relative flex border-y-2 border-gray-200 py-2 px-4 align-middle dark:border-slate-800">
              <h1 className="my-auto text-xl font-bold text-gray-800 dark:text-gray-200">
                Groups
              </h1>
              {groupsCollectionData &&
              groupsCollectionData.length !== 0 &&
              userGroupCollectionData &&
              userGroupCollectionData.length !== 0 ? (
                <button
                  className="absolute right-2 my-auto text-gray-600 transition-all hover:rotate-180 hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowGroupForm(!showGroupForm);
                  }}
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
                  {showGroupForm && (
                    <GroupForm
                      state={showGroupForm}
                      setState={setShowGroupForm}
                      groupName={groupName}
                      setGroupName={setGroupName}
                      friends={userFriendsCollectionData}
                      userId={auth.currentUser.uid}
                    />
                  )}
                </button>
              ) : (
                ""
              )}
            </div>
            {userGroupCollectionData && userGroupCollectionData.length !== 0 ? (
              <Group
                groups={groupsCollectionData}
                setActive={setActiveFriend}
                setGroupId={setGroupId}
                setActiveName={setActiveName}
              />
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
                    friends={userFriendsCollectionData}
                    userId={auth.currentUser.uid}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  //END OF Friends Section ( FriendsList and addFriend)

  //Chat section
  function Chat() {
    function ChatMessage(props) {
      const { image, text, uid, photoURL, sendTo, sentFrom, createdAt } =
        props.message;
      const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
      const date =
        createdAt != null &&
        moment(createdAt.toDate()).locale("vi").format("lll");
      if (
        (activeFriend === sendTo && auth.currentUser.uid === sentFrom) ||
        (activeFriend === sentFrom && auth.currentUser.uid === sendTo) ||
        groupId === sendTo
      ) {
        return (
          <div className={`flex space-x-2 space-y-2 ${messageClass}`}>
            <img
              className={`mb-1 mt-auto h-6 w-6 rounded-full ring-2 ring-blue-500 dark:ring-indigo-600 ${messageClass}`}
              src={photoURL}
              alt=""
            />
            {text ? (
              <p className="max-w-[15rem] whitespace-normal break-words rounded-xl bg-blue-500 p-2 py-1 dark:bg-indigo-500 sm:max-w-xl">
                {text}
              </p>
            ) : (
              ""
            )}
            {image && (
              <img
                src={image}
                className="max-h-96 w-60 max-w-xs rounded-xl sm:max-h-80 sm:w-auto xl:max-w-full "
                alt=""
              />
            )}
            <p className="self-center text-xs font-thin text-gray-800 dark:text-gray-400 sm:text-sm">
              {date}
            </p>
          </div>
        );
      } else return "";
    }

    return (
      <div className="px-1 pb-2 text-lg text-gray-200 dark:text-gray-200 xl:px-4">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
    );
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageValue !== "") {
      const { uid, photoURL } = auth.currentUser;
      await messagesRef.doc().set({
        text: messageValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        sentFrom: user.uid,
        sendTo: activeFriend,
      });
      setMessageValue("");
    }
  };
  //END OF Chat section

  //fileHandle section
  const fileHandle = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const fileImagesRef = ref(storage, "images/" + file.name);
    await uploadBytes(fileImagesRef, file).then((snapshot) => {});
    getDownloadURL(fileImagesRef).then(async (url) => {
      const { uid, photoURL } = auth.currentUser;
      await messagesRef.add({
        image: url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        sentFrom: user.uid,
        sendTo: activeFriend,
      });
    });
  };
  function File({ imgs }) {
    const filteredImgs =
      imgs != null &&
      imgs.filter((img) => {
        if (
          (activeFriend === img.sendTo &&
            auth.currentUser.uid === img.sentFrom) ||
          (activeFriend === img.sentFrom &&
            auth.currentUser.uid === img.sendTo) ||
          groupId === img.sendTo
        )
          return img.image;
      });
    function FileRender({ img }) {
      return (
        <li className="mx-1">
          <a
            className="cursor-pointer"
            onClick={() => window.open(img.image, img.image).focus()}
          >
            <img
              className="h-56 max-w-md rounded-md object-cover transition hover:-translate-y-1 sm:h-28"
              src={img.image}
              alt=""
            />
          </a>
        </li>
      );
    }
    return (
      <ul className="flex max-h-60 flex-row-reverse justify-end py-2 sm:max-h-32">
        {imgs &&
          filteredImgs.map((img, index) => {
            if (filteredImgs.length < 6 || index > filteredImgs.length - 10)
              return <FileRender img={img} key={index} />;
          })}
      </ul>
    );
  }
  //END OF fileHandle section
  /*END OF Component Section*/
  return (
    <section className="grid grid-cols-12 bg-gray-50 dark:bg-slate-900">
      <div className="col-span-3 hidden shadow-md shadow-gray-500 dark:shadow-slate-800 xl:block">
        <div className="flex border-b-2 border-gray-200 px-4 dark:border-slate-800">
          <h1 className="my-auto text-xl font-bold text-gray-800 dark:text-gray-200">
            Friends
          </h1>
          <form className="group relative ml-auto py-3 sm:mr-2">
            <input
              className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 md:focus:w-44 md:group-hover:w-44"
              type="search"
              name="search"
              placeholder="Find a Friends..."
            />
            <button className="absolute right-2 top-0 mt-5 text-gray-600 transition-all hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300">
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
          </form>
          <form className="group relative my-auto py-3" onSubmit={addfriend}>
            <input
              key="uidInput"
              className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 xl:focus:w-44 xl:group-hover:w-44"
              type="text"
              placeholder="Add a Friend UID"
              value={uidValue}
              onChange={(e) => setUidValue(e.target.value)}
            />
            <button
              className="absolute right-2 top-0 mt-5 text-gray-600 transition-all group-hover:rotate-180 dark:text-gray-50"
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
        <Friends msg={messages} />
      </div>
      <div className="col-span-12 grid h-screen grid-rows-6 lg:col-span-9 xl:col-span-7">
        <div className="row-span-5">
          <div className="flex h-10 bg-gradient-to-r from-blue-300 to-blue-50 text-2xl font-medium text-gray-800 dark:from-indigo-800 dark:to-transparent dark:text-gray-200 xl:h-16 xl:text-3xl">
            <div className="flex p-1 text-lg xl:hidden xl:p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-8 w-8 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => setShowFriendList(!showFriendList)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              {
                <SlideOver
                  content={
                    <div>
                      <div className="flex border-b-2 border-gray-200 px-4 dark:border-slate-800">
                        <h1 className="my-auto text-xl font-bold text-gray-800 dark:text-gray-200">
                          Friends
                        </h1>
                        <form className="group relative ml-auto py-3 sm:mr-2">
                          <input
                            className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 md:focus:w-44 md:group-hover:w-44"
                            type="search"
                            name="search"
                            placeholder="Find a Friends..."
                          />
                          <button className="absolute right-2 top-0 mt-5 text-gray-600 transition-all hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300">
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
                        </form>
                        <form
                          className="group relative my-auto py-3"
                          onSubmit={addfriend}
                        >
                          <input
                            key="uidInput"
                            className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 xl:focus:w-44 xl:group-hover:w-44"
                            type="text"
                            placeholder="Add a Friend UID"
                            value={uidValue}
                            onChange={(e) => setUidValue(e.target.value)}
                          />
                          <button
                            className="absolute right-2 top-0 mt-5 text-gray-600 transition-all group-hover:rotate-180 dark:text-gray-50"
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
                      <Friends msg={messages} />
                    </div>
                  }
                  state={showFriendList}
                  setState={setShowFriendList}
                />
              }
              <p className="line-clamp-1">{activeName}</p>
            </div>
            <div className="ml-3 hidden p-1 text-lg sm:text-3xl xl:inline-block xl:p-3">
              <p className="line-clamp-1 truncate text-ellipsis">
                {activeName}
              </p>
            </div>
            <div className="my-auto  mr-2 ml-auto flex space-x-3 text-blue-600 dark:text-indigo-500 sm:mr-6 sm:space-x-5">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 transition hover:-translate-y-1 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 transition hover:-translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <div className="place-self-end truncate overflow-ellipsis p-1 text-lg sm:text-3xl lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => setShowFile(!showFile)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                {
                  <SlideOver2
                    content={
                      <div>
                        <div className="mx-3">
                          <div className="overflow-auto">
                            <File imgs={messages} />
                          </div>
                          <a href="#" className="text-center">
                            <h1 className="text-md font-semibold text-blue-600 transition hover:underline dark:text-gray-300">
                              View shared file...
                            </h1>
                          </a>
                        </div>
                        <div className="grid grid-cols-2 content-center">
                          <a
                            href="#"
                            className="text-md group active col-span-1 flex justify-center border-b-4 border-blue-600 py-4 text-center font-medium text-blue-600 dark:border-indigo-500 dark:text-indigo-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 origin-bottom-right transform-gpu transition group-hover:-rotate-6 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                              />
                            </svg>
                            Members
                          </a>
                          <a
                            href="#"
                            className="text-md group col-span-1 flex justify-center border-b-2 py-4 text-center font-medium text-gray-600 dark:text-gray-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform-gpu transition group-hover:rotate-180"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Settings
                          </a>
                        </div>
                        <ul className="mt-3 space-y-2 overflow-auto">
                          {groupsCollectionData?.map((group) => {
                            return (
                              group?.groupId === groupId &&
                              group.friendsData.map((friendData, index) => {
                                return (
                                  <li
                                    key={index}
                                    className="group flex cursor-default truncate p-2 text-gray-800 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                                  >
                                    <img
                                      src={friendData.friendphotoURL}
                                      className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
                                    />
                                    <h1 className="ml-2 text-sm font-medium sm:text-lg">
                                      {friendData.friendName}
                                    </h1>
                                  </li>
                                );
                              })
                            );
                          })}
                        </ul>
                      </div>
                    }
                    state={showFile}
                    setState={setShowFile}
                  />
                }
              </div>
            </div>
          </div>
          <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-[86%] space-y-4 overflow-y-auto p-1 sm:h-5/6 sm:p-3">
            <Chat />
          </div>
        </div>
        {userFriendsCollectionData && userFriendsCollectionData.length !== 0 && (
          <div className="fixed bottom-5 row-start-6 w-[100%] lg:w-[75%] xl:w-[58%]">
            <form
              onSubmit={sendMessage}
              className="flex justify-center sm:px-3 xl:px-0"
            >
              <input
                type="file"
                className="hidden"
                id="selectedFile"
                onChange={fileHandle}
              />
              <label
                className="my-auto mx-1 cursor-pointer text-gray-600 transition hover:rotate-12 dark:text-gray-400 sm:mr-4"
                htmlFor="selectedFile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </label>
              <input
                className="w-5/6 rounded-full border-gray-300 focus:border-gray-300 focus:ring-0 dark:border-indigo-500 dark:bg-slate-900 dark:text-gray-200"
                type="text"
                placeholder="Type messages here..."
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
              />
              <button
                href=""
                className="my-auto mx-1 rotate-90 text-blue-600 transition hover:rotate-0 dark:text-indigo-500 sm:ml-4 "
                type="summit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="hidden pt-3 shadow-md shadow-gray-500 dark:shadow-slate-800 lg:col-span-3 lg:block xl:col-span-2">
        <div className="mx-3">
          <div className="overflow-auto">
            <File imgs={messages} />
          </div>
          <a href="#" className="text-center">
            <h1 className="text-md font-semibold text-blue-600 transition hover:underline dark:text-gray-300">
              View shared file...
            </h1>
          </a>
        </div>
        <div className="grid grid-cols-2 content-center">
          <a
            href="#"
            className="text-md group active col-span-1 flex justify-center border-b-4 border-blue-600 py-4 text-center font-medium text-blue-600 dark:border-indigo-500 dark:text-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 origin-bottom-right transform-gpu transition group-hover:-rotate-6 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            Members
          </a>
          <a
            href="#"
            className="text-md group col-span-1 flex justify-center border-b-2 py-4 text-center font-medium text-gray-600 dark:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform-gpu transition group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </a>
        </div>
        <ul className="mt-3 space-y-2 overflow-auto">
          {groupsCollectionData?.map((group) => {
            return (
              group?.groupId === groupId &&
              group.friendsData.map((friendData, index) => {
                return (
                  <li
                    key={index}
                    className="group flex cursor-default truncate p-2 text-gray-800 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                  >
                    <img
                      src={friendData.friendphotoURL}
                      className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
                    />
                    <h1 className="ml-2 text-sm font-medium sm:text-lg">
                      {friendData.friendName}
                    </h1>
                  </li>
                );
              })
            );
          })}
        </ul>
      </div>
    </section>
  );
});
export default Message;
