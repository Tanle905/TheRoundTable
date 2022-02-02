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

function Message() {
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
  const [userFriendsCollectionData] = useCollectionData(userFriendRef);
  //check for better solution
  const [activeFriend, setActiveFriend] = useState([""]);
  const [activeFriendName, setActiveFriendName] = useState([""]);

  // Messages init and variables
  const messagesRef = firebase.firestore().collection("messages");
  const [messageValue, setMessageValue] = useState("");
  const messagesQuery = messagesRef.orderBy("createdAt").limit(50);
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  /*END OF Init and Variables Section*/

  /*Component Section*/
  //Friends Section ( FriendsList and addFriend)

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
  function Friends({ msg }) {
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
          <div className="p-3 space-x-2 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
            <img
              className="w-16 max-h-16 rounded-full transition group-hover:ring-4 ring-blue-500 dark:ring-indigo-400"
              src={friendphotoURL}
              alt=""
            />
            <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-300">
              <h1 className="font-medium text-lg sm:text-xl">{friendName}</h1>
              <p className="truncate flex">
                <span className="mr-2">
                  {filteredMessages && filteredMessages.length !== 0
                    ? filteredMessages[filteredMessages.length - 1].uid ===
                      friendUid
                      ? ""
                      : "Bạn:"
                    : ""}
                </span>
                {filteredMessages &&
                filteredMessages.length !== 0 &&
                filteredMessages[filteredMessages.length - 1].text
                  ? filteredMessages[filteredMessages.length - 1].text
                  : filteredMessages &&
                    filteredMessages.length !== 0 &&
                    "đã gửi 1 ảnh"}
              </p>
            </div>
            <div className="col-span-1 mr-auto dark:text-gray-200 text-gray-700">
              <p className="text-xs">
                {filteredMessages.length !== 0 &&
                  moment(latestMessages).startOf("minute").fromNow()}
              </p>
            </div>
          </div>
        </li>
      );
    });
    return (
      <div>
        <div className="p-4 py-1 flex border-b-2 border-gray-200 dark:border-slate-800">
          <h1 className="font-bold my-auto text-gray-800 dark:text-gray-200 text-2xl">
            Chats
          </h1>
          <form className="py-3 my-auto ml-auto sm:mr-5 relative group">
            <input
              className="h-10 pr-10 w-10 ml-2 bg-gray-50 group-hover:bg-gray-200 dark:group-hover:bg-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 group-hover:w-36 focus:w-36 xl:group-hover:w-56 xl:focus:w-56 focus:border-0 focus:ring-0 form-input"
              type="search"
              name="search"
              placeholder="Search for Friends..."
              autoFocus={false}
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
          </form>
          <form className="py-3 my-auto relative group" onSubmit={addfriend}>
            <input
              className="h-10 pr-10 w-10 ml-2 bg-gray-50 group-hover:bg-gray-200 dark:group-hover:bg-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 group-hover:w-36 focus:w-36 xl:group-hover:w-56 xl:focus:w-56 focus:border-0 focus:ring-0 form-input"
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
        <ul className="space-y-3 flex flex-col h-screen overflow-auto">
          <p className="text-gray-800 dark:text-gray-200 p-1 mt-3 mb-0 my-auto bg-blue-200 dark:bg-slate-700 rounded-xl place-self-center">
            <span className="font-semibold">UID:</span> {auth.currentUser.uid}
          </p>
          {userFriendsCollectionData &&
            userFriendsCollectionData.map((element, index) => (
              <FriendsList friends={element} key={index} msg={msg} />
            ))}
        </ul>
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
        (activeFriend === sentFrom && auth.currentUser.uid === sendTo)
      ) {
        return (
          <div className={`flex space-x-2 space-y-2 ${messageClass}`}>
            <img
              className={`mb-1 rounded-full w-6 h-6 mt-auto ring-2 ring-blue-500 dark:ring-indigo-600 ${messageClass}`}
              src={photoURL}
              alt=""
            />
            {text ? (
              <p className="max-w-[15rem] sm:max-w-xl break-words whitespace-normal bg-blue-500 dark:bg-indigo-500 p-2 py-1 rounded-xl">
                {text}
              </p>
            ) : (
              ""
            )}
            {image && (
              <img
                src={image}
                className="w-60 sm:w-auto max-w-xs xl:max-w-full max-h-96 sm:max-h-80 rounded-xl"
                alt=""
              />
            )}
            <p className="text-xs sm:text-sm font-thin text-gray-800 dark:text-gray-400 self-center">
              {date}
            </p>
          </div>
        );
      } else return "";
    }

    return (
      <div className="px-1 xl:px-4 pb-2 text-gray-200 dark:text-gray-200 text-lg">
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
          (activeFriend === img.sentFrom && auth.currentUser.uid === img.sendTo)
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
              className="rounded-md max-w-md h-56 sm:h-28 object-cover transition hover:-translate-y-1"
              src={img.image}
              alt=""
            />
          </a>
        </li>
      );
    }
    return (
      <div>
        <div className="mx-3">
          <div className="overflow-auto">
            <ul className="max-h-60 sm:max-h-32 flex flex-row-reverse justify-end py-2">
              {imgs &&
                filteredImgs.map((img, index) => {
                  if (
                    filteredImgs.length < 6 ||
                    index > filteredImgs.length - 10
                  )
                    return <FileRender img={img} key={index} />;
                })}
            </ul>
          </div>
          <a href="" className="text-center">
            <h1 className="font-semibold text-md text-blue-600 dark:text-gray-300 transition hover:underline">
              View shared file...
            </h1>
          </a>
        </div>
        <div className="grid grid-cols-2 content-center">
          <a
            href="#"
            className="col-span-1 py-4 text-center text-blue-600 dark:text-indigo-500 text-md font-medium border-b-4 border-blue-600 dark:border-indigo-500 flex justify-center group active"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transition transform-gpu group-hover:scale-110 group-hover:-rotate-6 origin-bottom-right"
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
            Chat Members
          </a>
          <a
            href="#"
            className="col-span-1 py-4 text-center text-gray-600 dark:text-gray-300 text-md font-medium border-b-2 flex justify-center group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transition transform-gpu group-hover:rotate-180"
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
      </div>
    );
  }
  //END OF fileHandle section
  /*END OF Component Section*/
  return (
    <section className="bg-gray-50 dark:bg-slate-900 grid grid-cols-12">
      <div className="hidden xl:block col-span-3 shadow-md shadow-gray-500 dark:shadow-slate-800">
        <Friends msg={messages} />
      </div>
      <div className="h-screen col-span-12 lg:col-span-9 xl:col-span-7 grid grid-rows-6">
        <div className="row-span-5">
          <div className="flex py-1.5 bg-gradient-to-r from-blue-300 to-blue-50 dark:from-indigo-800 dark:to-transparent font-medium text-2xl sm:text-3xl text-gray-800 dark:text-gray-200">
            <div className="xl:hidden flex p-1 text-lg sm:text-3xl xl:p-3 overflow-ellipsis truncate">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2 cursor-pointer"
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
                  content={<Friends msg={messages} />}
                  state={showFriendList}
                  setState={setShowFriendList}
                />
              }
              {activeFriendName}
            </div>
            <div className="hidden xl:inline p-1 text-lg sm:text-3xl xl:p-3 ml-3 overflow-ellipsis truncate">
              {activeFriendName}
            </div>
            <div className="flex  mr-2 sm:mr-6 ml-auto my-auto space-x-3 sm:space-x-5 text-blue-600 dark:text-indigo-500">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 sm:h-8 w-7 sm:w-8 transition hover:-translate-y-1"
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
              <div className="lg:hidden place-self-end p-1 text-lg sm:text-3xl overflow-ellipsis truncate">
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
                    content={<File imgs={messages} />}
                    state={showFile}
                    setState={setShowFile}
                  />
                }
              </div>
            </div>
          </div>
          <div className="h-5/6 space-y-4 p-1 sm:p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <Chat />
          </div>
        </div>
        <div className="mb-auto row-start-6">
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
              className="text-gray-600 dark:text-gray-400 my-auto mx-1 sm:mr-4 transition hover:rotate-12 cursor-pointer"
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
              className="w-5/6 rounded-full dark:bg-slate-900 border-gray-300 dark:border-indigo-500 dark:text-gray-200 focus:ring-0 focus:border-gray-300"
              type="text"
              placeholder="Type messages here..."
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
            />
            <button
              href=""
              className="text-blue-600 dark:text-indigo-500 my-auto mx-1 sm:ml-4 rotate-90 transition hover:rotate-0 "
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
      </div>
      <div className="hidden lg:block lg:col-span-3 xl:col-span-2 pt-3 shadow-md shadow-gray-500 dark:shadow-slate-800">
        <File imgs={messages} />{" "}
      </div>
    </section>
  );
}

export default Message;
