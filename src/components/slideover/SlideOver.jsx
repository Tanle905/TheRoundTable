import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Friends } from "../friend/Friends";

export default function SlideOver({
  auth,
  firestore,
  user,
  userRef,
  usersCollectionData,
  userFriendRef,
  usersCollectionDataLoading,
  messages,
  userFriendsCollectionData,
  userFriendsCollectionDataIsLoading,
  groupRef,
  groupsCollectionData,
  activeFriend,
  setActiveFriend,
  setGroupId,
  setActiveName,
  showFriendList,
  setShowFriendList,
}) {
  let focusRef = useRef();
  return (
    <Transition.Root show={showFriendList} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setShowFriendList}
        initialFocus={focusRef}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 backdrop-blur-lg transition-opacity dark:bg-slate-800/75" />
          </Transition.Child>
          <div className="fixed inset-y-0 top-10 left-0 flex max-w-full sm:top-14">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="-translate-x-full"
              enterTo="-translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="-translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative w-screen max-w-xs sm:max-w-md">
                <div className="flex h-full flex-col bg-gray-50 py-5 shadow-xl dark:bg-slate-900">
                  <div ref={focusRef}>
                    <div className="flex border-b-2 border-gray-200 px-4 dark:border-slate-800"></div>
                    <Friends
                      auth={auth}
                      firestore={firestore}
                      user={user}
                      userRef={userRef}
                      usersCollectionData={usersCollectionData}
                      usersDataLoading={usersCollectionDataLoading}
                      userFriendRef={userFriendRef}
                      messages={messages}
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
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
