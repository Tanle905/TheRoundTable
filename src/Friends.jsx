import moment from "moment";
import firebase from "firebase/compat/app";
import React from "react";
import GroupForm from "./GroupForm";
import { Group } from "./Group";
import firstTimeGroupImg from "./svg/teammeeting.svg";
import friendSvg from "./svg/groupImg.svg";

function Friends({
  msg,
  userFriendsCollectionData,
  userFriendsCollectionDataIsLoading,
  groupsCollectionData,
  userGroupCollectionData,
  showGroupForm,
  activeFriend,
  setActiveFriend,
  setGroupId,
  setActiveName,
  setShowGroupForm,
  showFriendList,
  setShowFriendList,
}) {
  const auth = firebase.auth();
  const FriendsList = React.memo((props) => {
    const { friendUid, friendName, friendphotoURL } = props.friends;
    const friendClass =
      friendUid === activeFriend ? "friend-active" : "friend-inactive";
    const friendRefHandle = () => {
      setActiveFriend(friendUid);
      setActiveName(friendName);
      setGroupId(null);
    };

    const filteredMessages =
      friendUid &&
      props.msg &&
      props.msg.filter((message) => {
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
    console.log(
      filteredMessages && filteredMessages[filteredMessages.length - 1]
    );
    return (
      <li
        className={`group transition ${friendClass} `}
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
                    ? ""
                    : "You:"
                  : ""}
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
                filteredMessages &&
                filteredMessages.length !== 0 &&
                "sent a file"
              ) : filteredMessages &&
                filteredMessages.length !== 0 &&
                filteredMessages[filteredMessages.length - 1].deleted ? (
                "deleted a message"
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col-span-2 mr-auto text-gray-700 dark:text-gray-200">
            <p className="line-clamp-2 text-xs">
              {filteredMessages &&
                filteredMessages.length !== 0 &&
                moment(latestMessages).startOf("minute").fromNow()}
            </p>
          </div>
        </div>
      </li>
    );
  });
  return (
    <div>
      <div className="grid grid-rows-3">
        <ul className="row-span-1 flex h-[36vh] flex-col overflow-auto">
          <p
            className="my-1 cursor-pointer place-self-center rounded-xl bg-blue-200 p-1 text-gray-800 transition hover:bg-slate-500 dark:bg-slate-700 dark:text-gray-200"
            onClick={() => {
              navigator.clipboard.writeText(auth.currentUser.uid);
            }}
          >
            <span className="font-semibold">UID:</span> {auth.currentUser.uid}
          </p>
          {userFriendsCollectionData &&
          userFriendsCollectionData.length !== 0 ? (
            userFriendsCollectionData.map((element, index) => (
              <FriendsList friends={element} key={index} msg={msg} />
            ))
          ) : userFriendsCollectionDataIsLoading ? (
            <div className="flex h-[30vh] place-content-center bg-gray-50 dark:bg-slate-900">
              <div className="my-auto h-10 w-10 animate-bounce rounded-full bg-blue-500 shadow-2xl dark:bg-indigo-500 dark:shadow-indigo-800/75 sm:h-24 sm:w-24"></div>
            </div>
          ) : (
            <div className="flex h-[30vh] flex-col place-content-center overflow-auto">
              <img src={friendSvg} className="mx-auto h-2/4 w-2/4" />
              <h1 className="px-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                You do not have any friend. Let's make some!!!
              </h1>
            </div>
          )}
        </ul>
        <div className="row-span-2 max-w-xs sm:max-w-none">
          <div className=" relative flex border-y-2 border-gray-200 py-2 px-4 align-middle dark:border-slate-800">
            <h1 className="my-auto text-xl font-bold text-gray-800 dark:text-gray-200">
              Groups
            </h1>
            {groupsCollectionData &&
            groupsCollectionData.length !== 0 &&
            userGroupCollectionData &&
            userGroupCollectionData.length !== 0 ? (
              <button
                className="absolute right-2 my-auto text-gray-600 transition-all hover:rotate-180 hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300"
                onClick={(e) => {
                  if (showFriendList) setShowFriendList(!showFriendList);
                  e.preventDefault();
                  setShowGroupForm(!showGroupForm);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {showGroupForm && (
                  <GroupForm
                    state={showGroupForm}
                    setState={setShowGroupForm}
                    friends={userFriendsCollectionData}
                    userId={auth.currentUser.uid}
                  />
                )}
              </button>
            ) : (
              ""
            )}
          </div>
          {userGroupCollectionData && userGroupCollectionData.length !== 0 ? (
            <Group
              groups={groupsCollectionData}
              activeGroup={activeFriend}
              setActive={setActiveFriend}
              setGroupId={setGroupId}
              setActiveName={setActiveName}
            />
          ) : (
            <div className="flex flex-col place-content-center">
              <img src={firstTimeGroupImg} className="mx-auto h-2/4 w-2/4" />
              <h1 className="px-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                You do not have any group. Let's create one!!!
              </h1>
              <button
                onClick={(e) => {
                  if (showFriendList) setShowFriendList(!showFriendList);
                  e.preventDefault();
                  setShowGroupForm(!showGroupForm);
                }}
                className="m-5 mx-20 rounded-lg bg-blue-600 p-2 font-semibold text-gray-100 transition hover:-translate-y-1 hover:bg-blue-500 hover:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 2xl:mx-32"
              >
                Add Group
              </button>
              {showGroupForm && (
                <GroupForm
                  state={showGroupForm}
                  setState={setShowGroupForm}
                  friends={userFriendsCollectionData}
                  userId={auth.currentUser.uid}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;
