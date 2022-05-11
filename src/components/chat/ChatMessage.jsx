import moment from "moment";
import React from "react";

const ChatMessage = React.memo(
  ({ auth, message, activeFriend, groupId, messagesRef }) => {
    const {
      image,
      video,
      audio,
      file,
      fileName,
      text,
      id,
      deleted,
      photoURL,
      sendTo,
      sentFrom,
      createdAt,
    } = message;
    const messageClass =
      auth !== undefined && sentFrom === auth.currentUser.uid
        ? "sent"
        : "received";
    const date =
      createdAt != null &&
      moment(createdAt.toDate()).locale("vi").format("lll");

    function handleDeleteMessage() {
      messagesRef &&
        messagesRef.doc(id).update({
          deleted: true,
        });
    }
    if (
      (auth !== undefined &&
        activeFriend === sendTo &&
        auth.currentUser.uid === sentFrom) ||
      (auth !== undefined &&
        activeFriend === sentFrom &&
        auth.currentUser.uid === sendTo) ||
      (auth !== undefined && groupId === sendTo)
    ) {
      return !deleted ? (
        <div className={`flex space-x-2 space-y-2 ${messageClass} group`}>
          <img
            className={`mb-1 mt-auto h-4 w-4 rounded-full ring-2 ring-blue-500 dark:ring-indigo-600 ${messageClass}`}
            src={photoURL}
            alt=""
          />
          {text ? (
            <p
              className={`max-w-[15rem] rounded-md p-2 py-1 sm:max-w-xl ${messageClass} color`}
            >
              {text}
            </p>
          ) : (
            ""
          )}
          {image && (
            <img
              src={image}
              className="w-60 rounded-md sm:h-96 sm:w-auto sm:max-w-3xl"
              alt=""
            />
          )}
          {video && (
            <video
              controls
              src={video}
              className="w-60 rounded-md sm:h-96 sm:w-auto sm:max-w-3xl"
              alt=""
            />
          )}
          {file && (
            <div
              className={`flex w-60 rounded-md p-2 text-gray-100 ${messageClass} color`}
            >
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
            <div
              className={`w-64 rounded-md p-2 pb-0 text-gray-100 ${messageClass} color`}
            >
              <p className="truncate text-sm">{fileName}</p>
              <audio controls className="w-full py-2">
                <source src={audio} />
              </audio>
            </div>
          )}
          {messageClass === "sent" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 cursor-pointer self-center text-gray-800 transition hover:text-gray-500 dark:text-gray-400 lg:opacity-0 lg:group-hover:opacity-100"
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
          )}
          <p className="self-center text-xs font-thin text-gray-800 dark:text-gray-400 sm:text-sm">
            {date}
          </p>
        </div>
      ) : (
        <div className={`flex space-x-2 space-y-2 ${messageClass} `}>
          <img
            className={`mb-1 mt-auto h-4 w-4 rounded-full ring-2 ring-blue-500 dark:ring-indigo-600 ${messageClass}`}
            src={photoURL}
            alt=""
          />
          <div className="flex w-60 rounded-md border-2 border-gray-300 bg-transparent p-2 text-gray-400 dark:border-gray-700">
            <p>Message has been deleted.</p>
          </div>
        </div>
      );
    } else return "";
  }
);

export default ChatMessage;
