import React from "react";
import firebase from "firebase/compat/app";
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
const auth = firebase.auth();

const Chat = React.memo(({ messages, activeFriend, groupId }) => {
  const ChatMessage = React.memo((props) => {
    const {
      image,
      video,
      file,
      fileName,
      text,
      uid,
      photoURL,
      sendTo,
      sentFrom,
      createdAt,
    } = props.message;
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
          {video && (
            <video
              controls
              src={video}
              className="max-h-96 w-60 max-w-xs rounded-xl sm:max-h-80 sm:w-auto xl:max-w-full "
              alt=""
            />
          )}
          {file && (
            <div
              className="cursor-pointer rounded-sm bg-blue-500 p-3 text-gray-100 dark:bg-indigo-600"
              onClick={() => window.open(file).focus()}
            >
              <p>{fileName}</p>
            </div>
          )}
          <p className="self-center text-xs font-thin text-gray-800 dark:text-gray-400 sm:text-sm">
            {date}
          </p>
        </div>
      );
    } else return "";
  });
  return (
    <div className="px-1 pb-2 text-lg text-gray-200 dark:text-gray-200 xl:px-4">
      {messages &&
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  );
});

export default Chat;
