import React, { Fragment, useEffect, useState } from "react";
import GroupForm from "./GroupForm";
import { Group } from "./GroupList";
import FriendList from "./FriendList";
import friendSvg from "../../svg/groupImg.svg";

const removeFriend = (
  usersDataLoading,
  userRef,
  usersCollectionData,
  userFriendRef,
  auth,
  activeFriend
) => {
  if (!usersDataLoading && userRef) {
    usersCollectionData.forEach(async (element) => {
      if (element.uid === activeFriend) {
        await userFriendRef.doc(activeFriend).set({
          isFriend: false,
        });
        await userRef
          .doc(activeFriend)
          .collection("friends")
          .doc(auth.currentUser.uid)
          .set({
            isFriend: false,
          });
      }
    });
  }
};

function Friends({
  auth,
  firestore,
  user,
  userRef,
  usersCollectionData,
  userFriendRef,
  usersDataLoading: usersCollectionDataLoading,
  messages,
  userFriendsCollectionData,
  userFriendsCollectionDataIsLoading,
  groupRef,
  groupsCollectionData,
  activeFriend,
  setActiveFriend,
  setGroupId,
  setActiveName,
}) {
  const [filterFriendResult, setFilterFriendResult] = useState("");
  const [uidValue, setUidValue] = useState("");
  const [showGroupForm, setShowGroupForm] = useState(false);
  const mergedData = userFriendsCollectionData &&
    groupsCollectionData && [
      ...userFriendsCollectionData,
      ...groupsCollectionData,
    ];

  useEffect(() => {
    setActiveFriend(
      userFriendsCollectionData != null &&
        userFriendsCollectionData.length != 0 &&
        userFriendsCollectionData[0].friendUid
    );
    setActiveName(
      userFriendsCollectionData != null &&
        userFriendsCollectionData.length != 0 &&
        userFriendsCollectionData[0].friendName
    );
  }, [userFriendsCollectionData]);

  const addfriend = (event) => {
    event.preventDefault();
    if (!usersCollectionDataLoading && userRef) {
      usersCollectionData.forEach(async (element) => {
        if (element.uid === uidValue) {
          await userFriendRef.doc(uidValue).set({
            friendEmail: element.email,
            friendName: element.name,
            friendUid: element.uid,
            friendphotoURL: element.photoURL,
            isFriend: true,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
          await userRef.doc(uidValue).collection("friends").doc(user.uid).set({
            friendEmail: user.email,
            friendName: user.displayName,
            friendUid: user.uid,
            friendphotoURL: user.photoURL,
            isFriend: true,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        }
      });
      setUidValue("");
    }
  };
  return (
    <Fragment>
      <div className="flex border-b-2 border-gray-200 px-4 dark:border-slate-800">
        <h1 className="my-auto hidden text-xl font-bold text-gray-800 dark:text-gray-200 sm:inline-block">
          Friends
        </h1>
        <button
          className="my-auto ml-auto mr-3 text-gray-600 transition-all hover:scale-110 hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300"
          onClick={(e) => {
            e.preventDefault();
            setShowGroupForm(!showGroupForm);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {showGroupForm && (
            <GroupForm
              state={showGroupForm}
              setState={setShowGroupForm}
              groupRef={groupRef}
              friends={userFriendsCollectionData}
              userId={auth.currentUser.uid}
            />
          )}
        </button>
        <form className="group relative my-auto mr-2 py-3">
          <input
            className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 md:focus:w-44 md:group-hover:w-44"
            type="search"
            name="search"
            value={filterFriendResult}
            onChange={(e) =>
              setFilterFriendResult(e.target.value.toLowerCase())
            }
            placeholder="Find a Friends..."
          />
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute right-2 top-0 mt-5 text-gray-600 transition-all hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
        <form className="group relative my-auto py-3" onSubmit={addfriend}>
          <input
            key="uidInput"
            className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 xl:focus:w-44 xl:group-hover:w-44"
            type="text"
            placeholder="Add a Friend UID"
            value={uidValue}
            onChange={(e) => setUidValue(e.target.value)}
          />
          <button
            className="absolute right-2 top-0 mt-5 text-gray-600 transition-all group-hover:rotate-180 dark:text-gray-50"
            type="submit"
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
          </button>
        </form>
      </div>
      <div>
        <ul className=" flex max-h-[80vh] flex-col overflow-auto">
          <p
            className="my-1 cursor-pointer place-self-center rounded-xl bg-blue-200 p-1 text-gray-800 transition hover:bg-slate-500 dark:bg-slate-700 dark:text-gray-200"
            onClick={() => {
              navigator.clipboard.writeText(auth.currentUser.uid);
            }}
          >
            <span className="font-semibold">UID:</span> {auth.currentUser.uid}
          </p>
          {mergedData && mergedData.length !== 0 ? (
            mergedData.map(
              (element, index) =>
                (element.friendName !== undefined &&
                  element.friendName
                    .toLowerCase()
                    .includes(filterFriendResult) && (
                    <FriendList
                      auth={auth}
                      activeFriend={activeFriend}
                      setActiveFriend={setActiveFriend}
                      setActiveName={setActiveName}
                      setGroupId={setGroupId}
                      friend={element}
                      key={index}
                      messages={messages}
                    />
                  )) ||
                (element.name !== undefined &&
                  element.name.toLowerCase().includes(filterFriendResult) && (
                    <Group
                      key={index}
                      group={element}
                      activeGroup={activeFriend}
                      setActive={setActiveFriend}
                      setGroupId={setGroupId}
                      setActiveName={setActiveName}
                    />
                  ))
            )
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
      </div>
    </Fragment>
  );
}

export { Friends, removeFriend };
