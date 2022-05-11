import React from "react";
import firebase from "firebase/compat/app";
import ChatMessage from "./ChatMessage";

firebase.initializeApp({
  apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
  authDomain: "the-round-table-ffc3f.firebaseapp.com",
  projectId: "the-round-table-ffc3f",
  storageBucket: "the-round-table-ffc3f.appspot.com",
  messagingSenderId: "551826854387",
  appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
  measurementId: "G-3NRE8RWMTD",
});
const Chat = React.memo(
  ({
    auth,
    filterMessageResult,
    messages,
    activeFriend,
    groupId,
    messagesRef,
  }) => {
    return (
      <div className="px-1 pb-2 text-lg text-gray-200 dark:text-gray-200 xl:px-4">
        {messages &&
          messages.map(
            (msg, index) =>
              (msg.text &&
                msg.text.toLowerCase().includes(filterMessageResult) && (
                  <ChatMessage
                    key={msg.id}
                    auth={auth}
                    index={index}
                    message={msg}
                    messages={messages}
                    activeFriend={activeFriend}
                    groupId={groupId}
                    messagesRef={messagesRef}
                  />
                )) ||
              (filterMessageResult === "" && (
                <ChatMessage
                  key={msg.id}
                  auth={auth}
                  index={index}
                  message={msg}
                  messages={messages}
                  activeFriend={activeFriend}
                  groupId={groupId}
                  messagesRef={messagesRef}
                />
              ))
          )}
      </div>
    );
  }
);

export default Chat;
