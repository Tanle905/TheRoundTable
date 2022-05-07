import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import File from "../File";

export default function SlideOver2({
  messages,
  activeFriend,
  groupId,
  groupsCollectionData,
  state,
  setState,
}) {
  let focusRef = useRef()
  return (
    <Transition.Root show={state} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setState}
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
          <div className="fixed inset-y-0 top-14 right-0 flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-xs sm:max-w-md">
                <div className="flex h-full flex-col overflow-auto bg-gray-50 py-5 shadow-xl dark:bg-slate-900">
                  <div>
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
                      <p ref={focusRef}>Members</p>
                    </div>
                    <ul className="mt-3 space-y-2 overflow-auto">
                      {groupsCollectionData?.map((group) => {
                        return (
                          group?.groupId === groupId &&
                          group.friendsData.map((friendData, index) => {
                            return (
                              <li
                                key={index}
                                className="group flex cursor-default truncate p-2 text-gray-800 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                              >
                                <img
                                  src={friendData.friendphotoURL}
                                  className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
                                />
                                <h1 className="ml-2 text-sm font-medium sm:text-lg">
                                  {friendData.friendName}
                                </h1>
                              </li>
                            );
                          })
                        );
                      })}
                    </ul>
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
