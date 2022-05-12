import firebase from "firebase/compat/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React from "react";

const auth = firebase.auth();

const fileHandle = async (
  event,
  setFileIsLoading,
  storage,
  groupId,
  messagesRef,
  currentMessageRef,
  user,
  activeFriend,
  selectedGroupMembers,
  groupRef,
  userRef,
  userFriendRef
) => {
  event.preventDefault();
  setFileIsLoading(true);
  const file = event.target.files[0];
  const fileImagesRef = ref(storage, "files/" + file.name);
  await uploadBytes(fileImagesRef, file).then((snapshot) => {
    const fileType = snapshot.metadata.contentType.slice(
      0,
      snapshot.metadata.contentType.indexOf("/")
    );
    getDownloadURL(fileImagesRef).then(async (url) => {
      setFileIsLoading(false);
      const { uid, photoURL } = auth.currentUser;
      if (!groupId) {
        switch (fileType) {
          case "image": {
            await messagesRef.add({
              image: url,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, activeFriend],
            });
            break;
          }
          case "video": {
            await messagesRef.add({
              video: url,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, activeFriend],
            });
            break;
          }
          case "audio": {
            await messagesRef.add({
              audio: url,
              fileName: snapshot.metadata.name,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, activeFriend],
            });
            break;
          }
          default: {
            await messagesRef.add({
              file: url,
              fileName: snapshot.metadata.name,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, activeFriend],
            });
            break;
          }
        }
        await userRef
          .doc(activeFriend)
          .collection("friends")
          .doc(user.uid)
          .update({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        await userFriendRef.doc(activeFriend).update({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        switch (fileType) {
          case "image": {
            await messagesRef.add({
              image: url,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, ...selectedGroupMembers],
            });
            break;
          }
          case "video": {
            await messagesRef.add({
              video: url,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, ...selectedGroupMembers],
            });
            break;
          }
          case "audio": {
            await messagesRef.add({
              audio: url,
              fileName: snapshot.metadata.name,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, ...selectedGroupMembers],
            });
            break;
          }
          default: {
            await messagesRef.add({
              file: url,
              fileName: snapshot.metadata.name,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
              owner: [user.uid, ...selectedGroupMembers],
            });
            break;
          }
        }
        await groupRef.doc(groupId).update({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    });
  });
  currentMessageRef.current.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
};

function FileRender({ file }) {
  const { image, video, deleted } = file;
  return (
    !deleted && (
      <li className="mx-1">
        <a
          className="cursor-pointer"
          onClick={() => {
            if (file && image) {
              window.open(image).focus();
            } else window.open(video).focus();
          }}
        >
          {image && (
            <img
              className="h-56 max-w-md rounded-md object-cover transition hover:-translate-y-1 sm:h-28"
              src={image}
              alt=""
            />
          )}
          {video && (
            <video
              autoPlay
              loop
              muted
              className="h-56 max-w-md rounded-md object-cover transition hover:-translate-y-1 sm:h-28"
              src={video}
              alt=""
            />
          )}
        </a>
      </li>
    )
  );
}
const File = React.memo(({ messages, activeFriend, groupId }) => {
  const filteredMessages =
    messages != null &&
    messages.filter((message) => {
      if (
        (activeFriend === message.sendTo &&
          auth.currentUser.uid === message.sentFrom) ||
        (activeFriend === message.sentFrom &&
          auth.currentUser.uid === message.sendTo) ||
        groupId === message.sendTo
      )
        return !message.text && !message.audio && !message.file && message;
    });
  return (
    <ul className="flex max-h-60 flex-row-reverse justify-end py-2 sm:max-h-32">
      {messages &&
        filteredMessages.map((message, index) => {
          if (
            filteredMessages.length < 6 ||
            index > filteredMessages.length - 7
          )
            return <FileRender file={message} key={index} />;
        })}
    </ul>
  );
});

export { File, fileHandle };
