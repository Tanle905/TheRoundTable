import firebase from "firebase/compat/app";
import React from "react";

const auth = firebase.auth();

const File = React.memo(({ files, activeFriend, groupId }) => {
  const filteredImgs =
    files != null &&
    files.filter((img) => {
      if (
        (activeFriend === img.sendTo &&
          auth.currentUser.uid === img.sentFrom) ||
        (activeFriend === img.sentFrom &&
          auth.currentUser.uid === img.sendTo) ||
        groupId === img.sendTo
      )
        return img;
    });
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
  return (
    <ul className="flex max-h-60 flex-row-reverse justify-end py-2 sm:max-h-32">
      {files &&
        filteredImgs.map((file, index) => {
          if (filteredImgs.length < 6 || index > filteredImgs.length - 10)
            return !file.file && <FileRender file={file} key={index} />;
        })}
    </ul>
  );
});

export default File;
