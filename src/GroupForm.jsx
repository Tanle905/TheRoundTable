import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import { addGroup } from "./Group";

export default function GroupForm({
  state,
  setState,
  groupName,
  setGroupName,
  friends,
  userId
}) {
  const [selectedFriends, setSelectedFriends] = useState([userId]);
  const handleSelectedFriends = (friend) => {
    selectedFriends.includes(friend.friendUid)
    ? setSelectedFriends((prev) =>
    prev.filter((element) => element != friend.friendUid)
    )
    : setSelectedFriends([...selectedFriends, friend.friendUid]);
  };
  
  return (
    <Transition show={state} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={state}
        onClose={() => setState(false)}
        initialFocus={null}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-200/20" />
        </Transition.Child>
        <div className="fixed max-w-xs h-fit inset-x-10 sm:inset-x-52 inset-y-52">
          <form onSubmit={(e) => addGroup(e, groupName, setGroupName, selectedFriends, friends)}>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="-translate-y-full"
              enterTo="-translate-y-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="-translate-y-0"
              leaveTo="-translate-y-full"
            >
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Group name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className="shadow overflow-hidden">
                  <div className="px-4 py-5 bg-white">
                    <h1 className="font-semibold">Select member</h1>
                    <div className="max-h-20 overflow-auto flex flex-col">
                      {friends &&
                        friends.map((friend, index) => {
                          return (
                            <label
                              htmlFor=""
                              key={index}
                              onClick={() => handleSelectedFriends(friend)}
                            >
                              <input type="checkbox" name="friend-name" className="transition-all m-2"/>
                              {friend.friendName}
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Transition.Child>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
}
