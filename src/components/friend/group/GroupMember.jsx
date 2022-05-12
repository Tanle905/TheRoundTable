import Dropdown from "../../Dropdown";
import firebase from "firebase/compat/app";
import { Fragment } from "react/cjs/react.production.min";

export default function GroupMember({
  groupRef,
  groupsCollectionData,
  groupId,
}) {
  function deleteMemberHandle(friendUid) {
    const selectedGroup = groupsCollectionData?.filter(
      (group) => group?.groupId === groupId
    );
    const newFriendsDataList =
      selectedGroup[0].friendsData &&
      selectedGroup[0].friendsData.filter(
        (data) => data.friendUid !== friendUid
      );
    const newMemberList =
      selectedGroup[0].members &&
      selectedGroup[0].members.filter((data) => data !== friendUid);
    groupRef.doc(groupId).update({
      friendsData: [...newFriendsDataList],
      members: [...newMemberList],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  return (
    <Fragment>
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
      <ul className="mt-3 h-[64vh] space-y-2 overflow-auto">
        {groupsCollectionData?.map((group) => {
          return (
            group?.groupId === groupId &&
            group.friendsData.map((friendData, index) => {
              return (
                <li
                  key={index + 1}
                  className="group relative flex cursor-default p-2 text-gray-800 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  <img
                    src={friendData.friendphotoURL}
                    className="max-h-10 w-10 rounded-full ring-blue-500 transition group-hover:ring-4 dark:ring-indigo-400"
                  />
                  <h1 className="ml-2 mr-3 truncate text-xs font-medium sm:text-sm">
                    {friendData.friendName}
                  </h1>
                  {group.admin === friendData.friendUid && (
                    <span className="mb-5 mr-3 rounded-md p-1 text-xs font-semibold text-yellow-500 ring-2 ring-yellow-600">
                      Admin
                    </span>
                  )}
                  {group.admin !== friendData.friendUid &&
                    firebase.auth().currentUser.uid === group.admin && (
                      <Dropdown
                        host={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="my-auto h-5 w-5"
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
                          options: [
                            <div
                              className="flex space-x-3"
                              onClick={() =>
                                deleteMemberHandle(friendData.friendUid)
                              }
                            >
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
                              <p>Remove Member</p>
                            </div>,
                          ],
                        }}
                      />
                    )}
                </li>
              );
            })
          );
        })}
      </ul>
    </Fragment>
  );
}
