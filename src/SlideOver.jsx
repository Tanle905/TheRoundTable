import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Friends from "./Friends";

export default function SlideOver({
  auth,
  addfriend,
  uidValue,
  setUidValue,
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
  messages,
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
                  <div>
                    <div className="flex border-b-2 border-gray-200 px-4 dark:border-slate-800">
                      <h1
                        className="my-auto text-xl font-bold text-gray-800 dark:text-gray-200"
                        ref={focusRef}
                      >
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
                      <form
                        className="group relative my-auto py-3"
                        onSubmit={addfriend}
                      >
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
                      setShowGroupForm={setShowGroupForm}
                      showFriendList={showFriendList}
                      setShowFriendList={setShowFriendList}
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
