import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import { useCollectionData } from "react-firebase-hooks/firestore";
import moment from "moment";

export default function Admin({ username, password }) {
  const userRef = firebase.firestore().collection("users");
  const [usersCollectionData] = useCollectionData(userRef);
  const messagesRef = firebase.firestore().collection("messages");
  const messagesQuery = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  let navigate = useNavigate();
  const [active, setActive] = useState("users-button");

  function logoutHandle() {
    navigate("/admin-login");
  }
  function handleBanUser(user) {
    userRef.doc(user.uid).update({
      banned: true,
    });
  }
  function handleUnbanUser(user) {
    userRef.doc(user.uid).update({
      banned: false,
    });
  }
  function handleDeleteMessage(msg){
    console.log(msg)
  }

  const ChatMessage = React.memo(({ message, activeFriend, groupId }) => {
    const {
      image,
      video,
      audio,
      file,
      fileName,
      text,
      photoURL,
      createdAt,
    } = message;
    const date =
      createdAt != null &&
      moment(createdAt.toDate()).locale("vi").format("lll");
    {
      return (
        <div className={`flex space-x-2 space-y-2`}>
          <img
            className={`mb-1 mt-auto h-6 w-6 rounded-full ring-2 ring-blue-500 dark:ring-indigo-600`}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="self-center h-5 w-5 cursor-pointer text-gray-800 transition hover:-translate-y-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={() => handleDeleteMessage(message)}
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
  });

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="flex h-16 bg-gray-200 px-10 shadow-sm">
        <h1 className="my-auto text-2xl font-bold">Admin Page.</h1>
        <button
          onClick={() => logoutHandle()}
          className="my-3 ml-auto rounded-md bg-indigo-600 px-4 font-semibold text-gray-100 transition hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          Log out
        </button>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-2 flex h-screen flex-col bg-sky-900/80 p-3 font-semibold text-gray-100">
          <button
            id="users-button"
            onClick={(e) => setActive(e.target.id)}
            className={`p-3 ${active === "users-button" && "admin-active"}`}
          >
            Users
          </button>
          <button
            id="messages-button"
            onClick={(e) => setActive(e.target.id)}
            className={`p-3 ${active === "messages-button" && "admin-active"}`}
          >
            Messages
          </button>
        </div>
        <div className="col-span-10 h-[91vh] space-y-3 overflow-auto p-4">
          {active === "users-button" &&
            usersCollectionData &&
            usersCollectionData.map((user, index) => {
              return (
                <div
                  className="flex max-w-md space-x-3 rounded-lg bg-blue-700/75 p-2 text-gray-100"
                  key={index}
                >
                  <img
                    src={user.photoURL}
                    className="w-10 rounded-full"
                    alt=""
                  />
                  <p className="my-auto w-1/2 truncate text-lg">{user.name}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="my-auto h-5 w-5 cursor-pointer justify-self-end text-gray-100 transition hover:-translate-y-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => handleBanUser(user)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="my-auto h-5 w-5 cursor-pointer justify-self-end text-gray-100 transition hover:-translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    onClick={() => handleUnbanUser(user)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {user.banned && <p className="my-auto">Banned</p>}
                </div>
              );
            })}
          {active === "messages-button" && (
            <div className="px-1 pb-2 text-lg text-gray-200 dark:text-gray-200 xl:px-4">
              {messages &&
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
