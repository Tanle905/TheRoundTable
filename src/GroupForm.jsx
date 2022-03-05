import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import { addGroup } from "./Group";

export default function GroupForm({
  state,
  setState,
  friends,
  userId,
}) {
  const [groupName, setGroupName] = useState("");
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
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="-translate-y-full"
          enterTo="-translate-y-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="-translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div className="fixed inset-x-10 inset-y-52 h-fit max-w-xs rounded-xl bg-white sm:inset-x-52">
            <form
              onSubmit={(e) =>
                addGroup(e, groupName, setGroupName, selectedFriends, friends)
              }
            >
              <div className="overflow-hidden rounded-xl shadow-lg">
                <div className="px-4 py-5">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className="overflow-hidden shadow">
                  <div className="px-4 py-5">
                    <h1 className="font-semibold">Select member</h1>
                    <div className="flex max-h-32 flex-col overflow-auto md:max-h-60">
                      {friends &&
                        friends.map((friend, index) => {
                          return (
                            <label
                              htmlFor=""
                              key={index}
                              onClick={() => handleSelectedFriends(friend)}
                            >
                              <input
                                type="checkbox"
                                name="friend-name"
                                className="m-2 transition-all"
                              />
                              {friend.friendName}
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
