import firebase from "firebase/compat/app";
import React from "react";

const auth = firebase.auth();

function FileRender({ file }) {
  const { image, video } = file;
  return (
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
        return !message.text && !message.audio &&  message;
    });
  return (
    <ul className="flex max-h-60 flex-row-reverse justify-end py-2 sm:max-h-32">
      {messages &&
        filteredMessages.map((message, index) => {
          if (filteredMessages.length < 6 || index > filteredMessages.length - 7)
            return <FileRender file={message} key={index} />;
        })}
    </ul>
  );
});

export default File;
