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

const ChatMessage = React.memo(({ message, activeFriend, groupId }) => {
  const {
    image,
    video,
    audio,
    file,
    fileName,
    text,
    uid,
    photoURL,
    sendTo,
    sentFrom,
    createdAt,
  } = message;
  const messageClass = auth!==null && uid === auth.currentUser.uid ? "sent" : "received";
  const date =
    createdAt != null && moment(createdAt.toDate()).locale("vi").format("lll");
  if (
    (activeFriend === sendTo && auth.currentUser.uid === sentFrom) ||
    (activeFriend === sentFrom && auth.currentUser.uid === sendTo) ||
    groupId === sendTo
  ) {
    return (
      <div className={`flex space-x-2 space-y-2 ${messageClass} `}>
        <img
          className={`mb-1 mt-auto h-6 w-6 rounded-full ring-2 ring-blue-500 dark:ring-indigo-600 ${messageClass}`}
          src={photoURL}
          alt=""
        />
        {text ? (
          <p className="max-w-[15rem] rounded-xl bg-blue-500 p-2 py-1 dark:bg-indigo-500 sm:max-w-xl">
            {text}
          </p>
        ) : (
          ""
        )}
        {image && (
          <img
            src={image}
            className="w-60 rounded-md sm:h-80 sm:w-auto xl:max-w-2xl "
            alt=""
          />
        )}
        {video && (
          <video
            controls
            src={video}
            className="w-64 rounded-md sm:max-h-80 sm:w-auto xl:max-w-full "
            alt=""
          />
        )}
        {file && (
          <div className="flex w-60 rounded-md bg-blue-500 p-2 text-gray-100 dark:bg-indigo-600">
            <p className="mr-3 truncate text-center text-sm">{fileName}</p>
            <div
              className="cursor-pointer rounded-md bg-gray-200 p-1 transition hover:-translate-y-0.5 hover:bg-gray-300"
              onClick={() => window.open(file).focus()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        )}
        {audio && (
          <div className="w-64 rounded-md bg-blue-500 p-2 pb-0 text-gray-100 dark:bg-indigo-600">
            <p className="truncate text-sm">{fileName}</p>
            <audio controls className="w-full py-2">
              <source src={audio} />
            </audio>
          </div>
        )}
        <p className="self-center text-xs font-thin text-gray-800 dark:text-gray-400 sm:text-sm">
          {date}
        </p>
      </div>
    );
  } else return "";
});

const Chat = React.memo(({ messages, activeFriend, groupId }) => {
  return (
    <div className="px-1 pb-2 text-lg text-gray-200 dark:text-gray-200 xl:px-4">
      {messages &&
        messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            activeFriend={activeFriend}
            groupId={groupId}
          />
        ))}
    </div>
  );
});

export default Chat;
