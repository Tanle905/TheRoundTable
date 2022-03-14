import React, { useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SlideOver from "./SlideOver";
import SlideOver2 from "./SlideOver2";
import Chat from "./Chat";
import File from "./File";
import Friends from "./Friends";
import RTC from "./webRTC";

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
  const auth = firebase.auth();
  const [user] = useAuthState(auth);
  const userRef = firebase.firestore().collection("users");
  const [usersCollectionData, usersDataLoading] = useCollectionData(userRef);

  //fileHandle init and variables
  const storage = getStorage(firebaseApp);
  const [showFile, setShowFile] = useState(false);

  //Friends init and variable
  const [uidValue, setUidValue] = useState("");
  const [showFriendList, setShowFriendList] = useState(false);
  const userFriendRef = user
    ? userRef.doc(user.uid).collection("friends")
    : null;
  const [userFriendsCollectionData, userFriendsCollectionDataIsLoading] =
    useCollectionData(userFriendRef);
  const [activeFriend, setActiveFriend] = useState([""]);
  const [activeName, setActiveName] = useState([""]);

  // Messages init and variables
  const messagesRef = firebase.firestore().collection("messages");
  const [messageValue, setMessageValue] = useState("");
  const messagesQuery = messagesRef.orderBy("createdAt").limit(50);
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  let currentMessageRef = useRef();
  /*END OF Init and Variables Section*/

  //Group init and variables
  const groupRef = firebase.firestore().collection("groups");
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [groupsCollectionData] = useCollectionData(groupRef);
  const [userGroupCollectionData, userGroupCollectionDataIsLoading] =
    useCollectionData(
      userRef.doc(firebase.auth().currentUser.uid).collection("groups")
    );
  //End of group init and variables

  //WebRTC init and variables
  const servers = {
    iceservers: [
      {
        urls: [
          "stun.l.google.com:19302",
          "stun3.l.google.com:19302",
          "stunserver.org",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const [pc, setPc] = useState(new RTCPeerConnection(servers));
  let localStream = null;
  let remoteStream = null;
  const [isCalling, setIsCalling] = useState(false);
  let localStreamRef = useRef(null);
  let remoteStreamRef = useRef(null);
  //End of WebRTC init and variables

  /*Component Section*/
  //Friends Section ( FriendsList and addFriend)
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
    if (!usersDataLoading && userRef) {
      usersCollectionData.forEach((element) => {
        if (element.uid === uidValue) {
          userFriendRef.doc(uidValue).set({
            friendEmail: element.email,
            friendName: element.name,
            friendUid: element.uid,
            friendphotoURL: element.photoURL,
          });
          userRef.doc(uidValue).collection("friends").doc(user.uid).set({
            friendEmail: user.email,
            friendName: user.displayName,
            friendUid: user.uid,
            friendphotoURL: user.photoURL,
          });
        }
      });
      setUidValue("");
    }
  };

  //END OF Friends Section ( FriendsList and addFriend)

  //Chat section

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageValue !== "") {
      const { uid, photoURL } = auth.currentUser;
      await messagesRef.doc().set({
        text: messageValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        sentFrom: user.uid,
        sendTo: activeFriend,
      });
      setMessageValue("");
      currentMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };
  //END OF Chat section

  //fileHandle section
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const fileHandle = async (event) => {
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
        switch (fileType) {
          case "image": {
            await messagesRef.add({
              image: url,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid,
              photoURL,
              sentFrom: user.uid,
              sendTo: activeFriend,
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
            });
            break;
          }
        }
      });
    });
    currentMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };
  //END OF fileHandle section

  //WebRTC section
  const videoCallHandle = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    remoteStream = new MediaStream();
    //Push track from local stram to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    //Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    let localVideo = localStreamRef.current;
    localVideo.srcObject = localStream;
    localVideo.play();
    let remoteVideo = remoteStreamRef.current;
    remoteVideo.srcObject = remoteStream;
    remoteVideo.play();
  };
  //End of WebRTC section

  /*END OF Component Section*/
  return (
    <section className="grid grid-cols-12 bg-gray-50 dark:bg-slate-900">
      <div className="col-span-3 hidden shadow-md shadow-gray-500 dark:shadow-slate-800 xl:block">
        <div className="flex border-b-2 border-gray-200 px-4 dark:border-slate-800">
          <h1 className="my-auto text-xl font-bold text-gray-800 dark:text-gray-200">
            Friends
          </h1>
          <form className="group relative ml-auto py-3 sm:mr-2">
            <input
              className="form-input ml-2 h-10 w-10 transform rounded-md border-0 bg-gray-50 pr-10 font-semibold duration-200 focus:w-36 focus:border-0 focus:ring-0 group-hover:w-36 group-hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-50 dark:placeholder:text-slate-400 dark:group-hover:bg-slate-800 md:focus:w-44 md:group-hover:w-44"
              type="search"
              name="search"
              placeholder="Find a Friends..."
            />
            <button className="absolute right-2 top-0 mt-5 text-gray-600 transition-all hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300">
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
        <Friends
          auth={auth}
          msg={messages}
          userFriendsCollectionData={userFriendsCollectionData}
          userFriendsCollectionDataIsLoading={
            userFriendsCollectionDataIsLoading
          }
          groupsCollectionData={groupsCollectionData}
          userGroupCollectionData={userGroupCollectionData}
          showGroupForm={showGroupForm}
          activeFriend={activeFriend}
          setActiveFriend={setActiveFriend}
          setGroupId={setGroupId}
          setActiveName={setActiveName}
          showFriendList={showFriendList}
          setShowGroupForm={setShowGroupForm}
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
                  addfriend={addfriend}
                  uidValue={uidValue}
                  messages={messages}
                  userFriendsCollectionData={userFriendsCollectionData}
                  userFriendsCollectionDataIsLoading={
                    userFriendsCollectionDataIsLoading
                  }
                  groupsCollectionData={groupsCollectionData}
                  userGroupCollectionData={userGroupCollectionData}
                  showGroupForm={showGroupForm}
                  activeFriend={activeFriend}
                  setActiveFriend={setActiveFriend}
                  setGroupId={setGroupId}
                  setActiveName={setActiveName}
                  setShowGroupForm={setShowGroupForm}
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
            <div className="my-auto  mr-2 ml-auto flex space-x-3 text-blue-600 dark:text-indigo-500 sm:mr-6 sm:space-x-5">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 transition hover:-translate-y-1 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
              <button
                name="video-call"
                onClick={() => {
                  videoCallHandle();
                  setIsCalling(!isCalling);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 transition hover:-translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
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
                    messages={messages}
                    activeFriend={activeFriend}
                    groupId={groupId}
                    groupsCollectionData={groupsCollectionData}
                    state={showFile}
                    setState={setShowFile}
                  />
                }
              </div>
            </div>
          </div>
          <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-[75vh] space-y-4 overflow-y-auto p-1 sm:h-[69vh] sm:p-3">
            <Chat
              messages={messages}
              activeFriend={activeFriend}
              groupId={groupId}
            />
            <div ref={currentMessageRef}></div>
            {isCalling && (
              <RTC
                pc={pc}
                setPc={setPc}
                localStream={localStream}
                remoteStream={remoteStream}
                localStreamRef={localStreamRef}
                remoteStreamRef={remoteStreamRef}
                activeFriend={activeFriend}
              />
            )}
          </div>
        </div>
        {userFriendsCollectionData && userFriendsCollectionData.length !== 0 && (
          <div className="fixed bottom-0 row-start-6 w-[100%] bg-gray-50 p-5 dark:bg-slate-900 lg:w-[75%] xl:w-[58%]">
            <form
              onSubmit={sendMessage}
              className="flex justify-center sm:px-3 xl:px-0"
            >
              <input
                type="file"
                className="hidden"
                id="selectedFile"
                onChange={fileHandle}
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
              messages={messages}
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
        <div className="text-md group active flex justify-center border-b-4 border-blue-600 py-4 text-center font-medium text-blue-600 dark:border-indigo-500 dark:text-indigo-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 origin-bottom-right transform-gpu transition group-hover:-rotate-6 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <p>Members</p>
        </div>
        <ul className="mt-3 max-h-96 space-y-2 overflow-auto">
          {groupsCollectionData?.map((group) => {
            return (
              group?.groupId === groupId &&
              group.friendsData.map((friendData, index) => {
                return (
                  <li
                    key={index + 1}
                    className="group flex cursor-default p-2 text-gray-800 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                  >
                    <img
                      src={friendData.friendphotoURL}
                      className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
                    />
                    <h1 className="ml-2 truncate text-xs font-medium sm:text-sm">
                      {friendData.friendName}
                    </h1>
                  </li>
                );
              })
            );
          })}
        </ul>
      </div>
    </section>
  );
});
export default Message;
