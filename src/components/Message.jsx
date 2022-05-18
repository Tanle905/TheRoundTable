import React, { useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SlideOver from "./slideover/SlideOver";
import SlideOver2 from "./slideover/SlideOver2";
import { Chat, sendMessage } from "./chat/Chat";
import { File, fileHandle } from "./File";
import { Friends, removeFriend } from "./friend/Friends";
import Dropdown from "./Dropdown";
import _ from "lodash";
import { addMember } from "./friend/group/GroupList";
import GroupMember from "./friend/group/GroupMember";

const Message = React.memo(() => {
  /*Init and Variables Section*/
  //Firebase init
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
    authDomain: "the-round-table-ffc3f.firebaseapp.com",
    projectId: "the-round-table-ffc3f",
    storageBucket: "the-round-table-ffc3f.appspot.com",
    messagingSenderId: "551826854387",
    appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
    measurementId: "G-3NRE8RWMTD",
  });

  //Users init and variables
  const firestore = firebase.firestore;
  const auth = firebase.auth();
  const [user] = useAuthState(auth);
  const userRef = firestore().collection("users");
  const [usersCollectionData, usersCollectionDataLoading] =
    useCollectionData(userRef);

  //fileHandle init and variables
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const storage = getStorage(firebaseApp);
  const [showFile, setShowFile] = useState(false);

  //Friends init and variable
  const [showFriendList, setShowFriendList] = useState(false);
  const userFriendRef = user
    ? userRef.doc(user.uid).collection("friends")
    : null;
  const [userFriendsCollectionData, userFriendsCollectionDataIsLoading] =
    useCollectionData(userFriendRef.orderBy("createdAt", "desc"));
  const [activeFriend, setActiveFriend] = useState("");
  const [activeName, setActiveName] = useState([""]);

  //Group init and variables
  const [uidValue, setUidValue] = useState("");
  const groupRef = firestore().collection("groups");
  const [groupsCollectionData] = useCollectionData(groupRef);
  const [groupId, setGroupId] = useState("");
  const selectedGroup = groupsCollectionData
    ? groupsCollectionData.filter((data) => data.groupId === groupId)
    : null;
  const selectedGroupMembers =
    selectedGroup !== null && selectedGroup[0] ? selectedGroup[0].members : "";

  // Messages init and variables
  const [filterMessageResult, setFilterMessageResult] = useState("");
  const messagesRef = firestore().collection("messages");
  const [messageValue, setMessageValue] = useState("");
  const messagesQuery = messagesRef
    .where("owner", "array-contains", auth.currentUser.uid)
    .limit(100);
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  const sortedMessages = _.orderBy(messages, (o) => o.createdAt, "asc");
  let currentMessageRef = useRef();

  /*END OF Init and Variables Section*/

  const mergedData = userFriendsCollectionData &&
    groupsCollectionData && [
      ...(userFriendsCollectionData &&
        userFriendsCollectionData.filter((userFriend) => userFriend.isFriend)),
      ...(groupsCollectionData &&
        groupsCollectionData.filter((userGroup) =>
          userGroup.members.includes(auth.currentUser.uid)
        )),
    ];
  const mergedDataSorted = _.orderBy(mergedData, (o) => o.createdAt, "desc");

  /*Component Section*/
  //Friends Section ( FriendsList and addFriend)
  useEffect(() => {
    setActiveFriend(
      (mergedDataSorted != null &&
        mergedDataSorted.length != 0 &&
        mergedDataSorted[0].friendUid) ||
        (mergedDataSorted != null &&
          mergedDataSorted.length != 0 &&
          mergedDataSorted[0].groupId)
    );
    setActiveName(
      (mergedDataSorted != null &&
        mergedDataSorted.length != 0 &&
        mergedDataSorted[0].friendName) ||
        (mergedDataSorted != null &&
          mergedDataSorted.length != 0 &&
          mergedDataSorted[0].name)
    );
    setGroupId(
      mergedDataSorted != null &&
        mergedDataSorted.length != 0 &&
        mergedDataSorted[0].groupId
    );
  }, [groupsCollectionData, userFriendsCollectionData]);
  //END OF Friends Section ( FriendsList and addFriend)

  //Chat section
  useEffect(() => {
    currentMessageRef.current.scrollIntoView({
      block: "nearest",
      inline: "start",
    });
  }, [activeFriend]);
  //END OF Chat section

  //fileHandle section
  /*END OF Component Section*/
  return (
    <section className="grid grid-cols-12 bg-gray-50 dark:bg-slate-900">
      <div className="col-span-3 hidden shadow-md shadow-gray-500 dark:shadow-slate-800 xl:block">
        <Friends
          auth={auth}
          firestore={firestore}
          user={user}
          userRef={userRef}
          usersCollectionData={usersCollectionData}
          usersDataLoading={usersCollectionDataLoading}
          mergedDataSorted={mergedDataSorted}
          userFriendRef={userFriendRef}
          messages={sortedMessages}
          userFriendsCollectionData={userFriendsCollectionData}
          userFriendsCollectionDataIsLoading={
            userFriendsCollectionDataIsLoading
          }
          groupRef={groupRef}
          groupsCollectionData={groupsCollectionData}
          activeFriend={activeFriend}
          setActiveFriend={setActiveFriend}
          setGroupId={setGroupId}
          setActiveName={setActiveName}
          showFriendList={showFriendList}
        />
      </div>
      <div className="col-span-12 grid h-screen grid-rows-6 lg:col-span-9 xl:col-span-7">
        <div className="row-span-5">
          <div className="flex h-10 bg-gradient-to-r from-blue-300 to-blue-50 text-2xl font-medium text-gray-800 dark:from-indigo-800 dark:to-transparent dark:text-gray-200 xl:h-16 xl:text-3xl">
            <div className="flex p-1 text-lg xl:hidden xl:p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-8 w-8 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => setShowFriendList(!showFriendList)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              {
                <SlideOver
                  auth={auth}
                  firestore={firestore}
                  user={user}
                  userRef={userRef}
                  usersCollectionData={usersCollectionData}
                  usersDataLoading={usersCollectionDataLoading}
                  mergedDataSorted={mergedDataSorted}
                  userFriendRef={userFriendRef}
                  messages={sortedMessages}
                  userFriendsCollectionData={userFriendsCollectionData}
                  userFriendsCollectionDataIsLoading={
                    userFriendsCollectionDataIsLoading
                  }
                  groupRef={groupRef}
                  groupsCollectionData={groupsCollectionData}
                  activeFriend={activeFriend}
                  setActiveFriend={setActiveFriend}
                  setGroupId={setGroupId}
                  setActiveName={setActiveName}
                  showFriendList={showFriendList}
                  setShowFriendList={setShowFriendList}
                />
              }
              <p className="line-clamp-1">{activeName}</p>
            </div>
            <div className="ml-3 hidden p-1 text-lg sm:text-3xl xl:inline-block xl:p-3">
              <p className="line-clamp-1 truncate text-ellipsis">
                {activeName}
              </p>
            </div>
            <form className="group relative ml-2 lg:my-auto">
              <input
                className="form-input h-7 w-3 rounded-md border-0 bg-transparent font-semibold duration-200 placeholder:text-sm hover:border-2 focus:pr-8 group-hover:w-36 dark:text-gray-50 dark:placeholder:text-gray-400 sm:w-44 sm:group-hover:w-96 xl:h-12"
                type="search"
                name="search"
                value={filterMessageResult}
                onChange={(e) =>
                  setFilterMessageResult(e.target.value.toLowerCase())
                }
                placeholder="Find Messages..."
              />
              <button
                onClick={(e) => e.preventDefault()}
                className="absolute right-2 -top-2.5 mt-5 block text-gray-600 transition dark:text-gray-50 lg:-top-2 lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 lg:h-6 lg:w-6"
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
            {groupId && (
              <form className="group relative my-auto ml-auto py-3">
                <input
                  key="uidInput"
                  className="form-input my-auto h-7 w-3 rounded-md border-0 bg-transparent font-semibold duration-200 placeholder:text-sm hover:border-2 focus:pr-8 group-hover:w-36 dark:text-gray-50 dark:placeholder:text-gray-400 sm:w-44 sm:group-hover:w-96 xl:h-12"
                  type="text"
                  value={uidValue}
                  onChange={(e) => setUidValue(e.target.value)}
                  placeholder="Add a Friend UID"
                />
                <button
                  className="absolute right-2 bottom-6 text-gray-600 transition-all group-hover:rotate-180 dark:text-gray-50"
                  type="submit"
                  onClick={(event) =>
                    addMember(
                      event,
                      usersCollectionData,
                      groupsCollectionData,
                      groupRef,
                      groupId,
                      uidValue,
                      setUidValue
                    )
                  }
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
            )}
            <div className="relative my-auto mr-2 ml-auto flex space-x-3 text-blue-600 dark:text-indigo-500 sm:mr-6 sm:space-x-5">
              {mergedDataSorted && mergedDataSorted.length !== 0 ? (
                <Dropdown
                  host={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-auto h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  }
                  position="top-5"
                  contents={{
                    options:
                      groupsCollectionData &&
                      groupsCollectionData.filter(
                        (group) =>
                          group.groupId === groupId &&
                          group.admin === auth.currentUser.uid
                      ).length !== 0
                        ? [
                            <div className="flex space-x-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="my-auto h-5 w-5 transition hover:text-indigo-400 dark:text-indigo-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                                />
                              </svg>
                              <p
                                onClick={() =>
                                  removeFriend(
                                    groupId,
                                    groupRef,
                                    groupsCollectionData,
                                    usersCollectionDataLoading,
                                    userRef,
                                    usersCollectionData,
                                    userFriendRef,
                                    auth,
                                    activeFriend
                                  )
                                }
                              >
                                Remove {groupId ? "Group" : "Friend"}
                              </p>
                            </div>,
                          ]
                        : [
                            <div className="flex space-x-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="my-auto h-5 w-5 transition hover:text-indigo-400 dark:text-indigo-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                                />
                              </svg>
                              <p
                                onClick={() =>
                                  removeFriend(
                                    groupId,
                                    groupRef,
                                    groupsCollectionData,
                                    usersCollectionDataLoading,
                                    userRef,
                                    usersCollectionData,
                                    userFriendRef,
                                    auth,
                                    activeFriend
                                  )
                                }
                              >
                                {groupId ? "Leave Group" : "Remove Friend"}
                              </p>
                            </div>,
                          ],
                  }}
                />
              ) : (
                ""
              )}
              <div className="place-self-end truncate overflow-ellipsis p-1 text-lg sm:text-3xl lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => setShowFile(!showFile)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                {
                  <SlideOver2
                    groupRef={groupRef}
                    groupsCollectionData={groupsCollectionData}
                    groupId={groupId}
                    messages={sortedMessages}
                    activeFriend={activeFriend}
                    state={showFile}
                    setState={setShowFile}
                  />
                }
              </div>
            </div>
          </div>
          <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-[75vh] space-y-4 overflow-y-auto p-1 sm:h-[69vh] sm:p-3">
            <Chat
              auth={auth}
              filterMessageResult={filterMessageResult}
              messages={sortedMessages}
              activeFriend={activeFriend}
              groupId={groupId}
              messagesRef={messagesRef}
            />
            <div ref={currentMessageRef}></div>
          </div>
        </div>
        {userFriendsCollectionData && userFriendsCollectionData.length !== 0 && (
          <div className=" fixed bottom-0 row-start-6 mx-1 w-[100%] bg-gray-50 p-5 dark:bg-slate-900 lg:w-[75%] xl:w-[58%]">
            <form
              onSubmit={(e) =>
                sendMessage(
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
                )
              }
              className="flex justify-center sm:px-3 xl:px-0"
            >
              <input
                type="file"
                className="hidden"
                id="selectedFile"
                onChange={(e) =>
                  fileHandle(
                    e,
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
                  )
                }
              />
              <label
                className="my-auto mx-1 cursor-pointer text-gray-600 transition hover:rotate-12 dark:text-gray-400 sm:mr-4"
                htmlFor="selectedFile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </label>
              <input
                className="w-5/6 rounded-full border-gray-300 focus:border-gray-300 focus:ring-0 dark:border-indigo-500 dark:bg-slate-900 dark:text-gray-200"
                type="text"
                placeholder="Type messages here..."
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
              />
              {!fileIsLoading ? (
                <button
                  href=""
                  className="my-auto mx-1 rotate-90 text-blue-600 transition hover:rotate-0 dark:text-indigo-500 sm:ml-4 "
                  type="summit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              ) : (
                <svg
                  role="status"
                  className="my-auto mx-1 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:fill-indigo-500 dark:text-gray-600 sm:ml-4"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </form>
          </div>
        )}
      </div>
      <div className="hidden pt-3 shadow-md shadow-gray-500 dark:shadow-slate-800 lg:col-span-3 lg:block xl:col-span-2">
        <div className="mx-3">
          <div className="overflow-auto">
            <File
              messages={sortedMessages}
              activeFriend={activeFriend}
              groupId={groupId}
            />
          </div>
          <a href="#" className="text-center">
            <h1 className="text-md font-semibold text-blue-600 transition hover:underline dark:text-gray-300">
              View shared file...
            </h1>
          </a>
        </div>
        {groupId && (
          <GroupMember
            groupRef={groupRef}
            groupsCollectionData={groupsCollectionData}
            groupId={groupId}
          />
        )}
      </div>
    </section>
  );
});
export default Message;
