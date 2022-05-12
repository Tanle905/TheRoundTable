import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import File from "../File";
import GroupMember from "../friend/group/GroupMember";

export default function SlideOver2({
  groupRef,
  messages,
  activeFriend,
  groupId,
  groupsCollectionData,
  state,
  setState,
}) {
  let focusRef = useRef();
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
                        <h1 ref={focusRef} className="text-md font-semibold text-blue-600 transition hover:underline dark:text-gray-300">
                          View shared file...
                        </h1>
                      </a>
                    </div>
                    {groupId && <GroupMember
                      groupRef={groupRef}
                      groupsCollectionData={groupsCollectionData}
                      groupId={groupId}
                    />}
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
