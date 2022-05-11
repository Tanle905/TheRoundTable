import moment from "moment";
import React from "react";

const FriendList = React.memo(function FriendList({
  auth,
  activeFriend,
  setActiveFriend,
  setActiveName,
  setGroupId,
  friend,
  messages,
}) {
  const { friendUid, friendName, friendphotoURL, isFriend } = friend;
  const friendClass =
    friendUid === activeFriend ? "friend-active" : "friend-inactive";
  const friendRefHandle = () => {
    setActiveFriend(friendUid);
    setActiveName(friendName);
    setGroupId(null);
  };
  const filteredMessages =
    friendUid &&
    messages &&
    messages.filter((message) => {
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
  return isFriend ? (
    <li
      className={`group transition ${friendClass} group px-2`}
      onClick={friendRefHandle}
    >
      <div className="grid grid-cols-10 space-x-2 rounded-lg p-2 transition-all hover:cursor-pointer focus:bg-gray-200">
        <img
          className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
          src={friendphotoURL}
          alt=""
        />
        <div className="col-span-7 flex-col text-gray-800 dark:text-gray-300">
          <h1 className="truncate text-sm font-medium sm:text-lg">
            {friendName}
          </h1>
          <div className="flex text-xs">
            <span className="mr-2">
              {filteredMessages && filteredMessages.length !== 0
                ? filteredMessages[filteredMessages.length - 1].uid ===
                  friendUid
                  ? null
                  : "You:"
                : null}
            </span>
            {filteredMessages &&
            filteredMessages.length !== 0 &&
            !filteredMessages[filteredMessages.length - 1].deleted &&
            filteredMessages[filteredMessages.length - 1].text ? (
              <p className="truncate text-ellipsis">
                {filteredMessages[filteredMessages.length - 1].text}
              </p>
            ) : filteredMessages &&
              filteredMessages.length !== 0 &&
              !filteredMessages[filteredMessages.length - 1].deleted ? (
              filteredMessages && filteredMessages.length !== 0 && "sent a file"
            ) : filteredMessages &&
              filteredMessages.length !== 0 &&
              filteredMessages[filteredMessages.length - 1].deleted ? (
              "deleted a message"
            ) : filteredMessages !== undefined ? (
              "No message recently"
            ) : (
              <p className="w-36 h-4 bg-transparent"></p>
            )}
          </div>
        </div>
        <div className="col-span-2 mr-auto text-gray-700 dark:text-gray-200">
          <p className="line-clamp-2 text-xs">
            {filteredMessages &&
              filteredMessages.length !== 0 &&
              moment(latestMessages)
                .startOf("minute")
                .fromNow()
                .slice(
                  0,
                  moment(latestMessages)
                    .startOf("minute")
                    .fromNow()
                    .indexOf(" ", 3)
                )}
          </p>
        </div>
      </div>
    </li>
  ) : (
    ""
  );
});

export default FriendList;
