import React, { useEffect } from "react";
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

function sendMessage(
  e,
  currentMessageRef,
  messageValue,
  groupId,
  auth,
  messagesRef,
  user,
  activeFriend,
  selectedGroupMembers,
  groupRef,
  setMessageValue,
  userRef,
  userFriendRef
) {
  if (messageValue !== "") {
    if (!groupId) {
      e.preventDefault();
      const { photoURL } = auth.currentUser;
      const msgId = messagesRef.doc().id;
      messagesRef.doc(msgId).set({
        text: messageValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        id: msgId,
        photoURL,
        sentFrom: user.uid,
        sendTo: activeFriend,
        owner: [user.uid, activeFriend],
        deleted: false,
      });
      userFriendRef.doc(activeFriend).update({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      userRef.doc(activeFriend).collection("friends").doc(user.uid).update({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      currentMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    } else {
      e.preventDefault();
      const { photoURL } = auth.currentUser;
      const msgId = messagesRef.doc().id;
      messagesRef.doc(msgId).set({
        text: messageValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        id: msgId,
        photoURL,
        sentFrom: user.uid,
        sendTo: activeFriend,
        owner: [user.uid, ...selectedGroupMembers],
        deleted: false,
      });
      groupRef.doc(groupId).update({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setMessageValue("");
  }
}
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
              (((msg.text &&
                msg.text.toLowerCase().includes(filterMessageResult)) ||
                (msg.fileName &&
                  msg.fileName
                    .toLowerCase()
                    .includes(filterMessageResult))) && (
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

export { Chat, sendMessage };
