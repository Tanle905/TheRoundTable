import Dropdown from "./Dropdown";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useAuthState } from "react-firebase-hooks/auth";

function Header() {
  const auth = firebase.auth();
  const [user] = useAuthState(auth)

  return (
    <header className="bg-gray-50 dark:bg-slate-900 sticky shadow-sm dark:shadow-slate-800 z-50">
      <div className="flex sm:grid sm:grid-cols-4 sm:py-2">
        <div className="sm:col-span-2 my-auto sm:ml-2 flex text-blue-500 dark:text-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="my-auto ml-2 hidden sm:flex font-semibold text-md sm:text-2xl text-blue-600 dark:text-gray-300">
            Welcome to The Round Table!!!
          </h3>
        </div>
        <div className="sm:col-span-2 ml-auto flex justify-end">
          
          <div className="my-auto sm:mr-5">
            <ul className="col-span-1 flex space-x-5 text-xl font-semibold text-blue-600 dark:text-gray-300">
              <li className="duration-100 hover:text-blue-500 dark:hover:text-indigo-500 hover:scale-105">
                <a href="#" className="flex group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 group-hover:-rotate-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Chat
                </a>
              </li>
              <li className="duration-100 hover:text-blue-500 dark:hover:text-indigo-500 hover:scale-105">
                <a href="#" className="flex group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6  group-hover:-rotate-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Workspace
                </a>
              </li>
            </ul>
          </div>
          <div className="relative my-auto mr-1 sm:mr-3 xl:py-2">
            <Dropdown
              host={function () {
                return (
                  <a className="block ml-5 sm:ml-0 p-1 rounded-full bg-blue-600 dark:bg-indigo-700 transition hover:scale-110 hover:bg-blue-400 dark:hover:bg-indigo-500">
                    <img
                      className="max-w-full max-h-12 rounded-full cursor-pointer object-cover"
                      src={user && user.photoURL}
                      alt=""
                    />
                  </a>
                );
              }}
              position={`top-16`}
              contents={{
                options: [
                  // <div className="flex space-x-1">
                  //   <svg
                  //     xmlns="http://www.w3.org/2000/svg"
                  //     className="h-6 w-6 my-auto"
                  //     fill="none"
                  //     viewBox="0 0 24 24"
                  //     stroke="currentColor"
                  //   >
                  //     <path
                  //       strokeLinecap="round"
                  //       strokeLinejoin="round"
                  //       strokeWidth={2}
                  //       d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  //     />
                  //     <path
                  //       strokeLinecap="round"
                  //       strokeLinejoin="round"
                  //       strokeWidth={2}
                  //       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  //     />
                  //   </svg>
                  //   <p>Account Settings</p>
                  // </div>,
                  // <div className="flex space-x-1">
                  //   <svg
                  //     xmlns="http://www.w3.org/2000/svg"
                  //     className="h-6 w-6 my-auto"
                  //     fill="none"
                  //     viewBox="0 0 24 24"
                  //     stroke="currentColor"
                  //   >
                  //     <path
                  //       strokeLinecap="round"
                  //       strokeLinejoin="round"
                  //       strokeWidth={2}
                  //       d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  //     />
                  //   </svg>
                  //   <p>Support</p>
                  // </div>,
                  <div className="flex space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 my-auto"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.02 3.77v1.56l1-.99V2.5l-.5-.5h-9l-.5.5v.486L2 3v10.29l.36.46 5 1.72L8 15v-1h3.52l.5-.5v-1.81l-1-1V13H8V4.71l-.33-.46L4.036 3h6.984v.77zM7 14.28l-4-1.34V3.72l4 1.34v9.22zm6.52-5.8H8.55v-1h4.93l-1.6-1.6.71-.7 2.47 2.46v.71l-2.49 2.48-.7-.7 1.65-1.65z"
                      />
                    </svg>
                    <p onClick={() => auth.signOut()}>Sign Out</p>
                  </div>,
                ],
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
