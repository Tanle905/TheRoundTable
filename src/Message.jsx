function Message() {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-slate-900 grid grid-cols-12">
      <div className="col-start-1 sm:col-span-4 xl:col-span-3 shadow-md shadow-gray-500 dark:shadow-slate-800 z-10">
        <div className="p-4 py-1 flex border-b-2 border-gray-200">
          <h1 className="font-bold my-auto text-gray-800 dark:text-gray-50 text-2xl">
            Chats
          </h1>
          <div className="py-3 my-auto ml-auto sm:mr-5 relative group">
            <input
              className="h-10 pr-10 w-10 ml-2 bg-gray-50 group-hover:bg-gray-200 dark:group-hover:bg-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 sm:group-hover:w-36 xl:group-hover:w-56 focus:border-0 focus:ring-0 form-input"
              type="search"
              name="search"
              placeholder="Search"
            />
            <button className="absolute right-2 top-0 mt-5 text-gray-600 dark:text-gray-50 transition-all hover:text-gray-800">
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
          </div>
          <button>
            <button className="my-auto text-gray-600 dark:text-gray-50 ml-2 duration-200 transition hover:rotate-180">
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
          </button>
        </div>
        <ul className="space-y-3">
          <li className="hover:bg-gray-200 group transition">
            <div className="flex p-3 space-x-5 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
              <a href="" className="col-span-1">
                <img
                  className="w-16 h-16 rounded-full transition group-hover:ring-4 ring-blue-500"
                  src="https://placekitten.com/200/200"
                  alt=""
                />
              </a>
              <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-50">
                <h1 className="font-medium text-xl">Nyannnnnnnnn</h1>
                <p className="truncate">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Varius quam quisque id diam vel quam elementum.
                </p>
              </div>
              <div className="col-span-1 mr-auto dark:text-gray-50 text-gray-700">
                <p>25m</p>
              </div>
            </div>
          </li>
          <li className="hover:bg-gray-200 group transition">
            <div className="flex p-3 space-x-5 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
              <a href="" className="col-span-1">
                <img
                  className="w-16 h-16 rounded-full transition group-hover:ring-4 ring-blue-500"
                  src="https://placekitten.com/270/203"
                  alt=""
                />
              </a>
              <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-50">
                <h1 className="font-medium text-xl">Nyannnnnnnnn</h1>
                <p className="truncate">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Varius quam quisque id diam vel quam elementum.
                </p>
              </div>
              <div className="col-span-1 mr-auto dark:text-gray-50 text-gray-700">
                <p>25m</p>
              </div>
            </div>
          </li>
          <li className="hover:bg-gray-200 group transition">
            <div className="flex p-3 space-x-5 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
              <a href="" className="col-span-1">
                <img
                  className="w-16 h-16 rounded-full transition group-hover:ring-4 ring-blue-500"
                  src="https://placekitten.com/200/202"
                  alt=""
                />
              </a>
              <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-50">
                <h1 className="font-medium text-xl">Nyannnnnnnnn</h1>
                <p className="truncate">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Varius quam quisque id diam vel quam elementum.
                </p>
              </div>
              <div className="col-span-1 mr-auto dark:text-gray-50 text-gray-700">
                <p>25m</p>
              </div>
            </div>
          </li>
          <li className="hover:bg-gray-200 group transition">
            <div className="flex p-3 space-x-5 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
              <a href="" className="col-span-1">
                <img
                  className="w-16 h-16 rounded-full transition group-hover:ring-4 ring-blue-500"
                  src="https://placekitten.com/200/201"
                  alt=""
                />
              </a>
              <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-50">
                <h1 className="font-medium text-xl">Nyannnnnnnnn</h1>
                <p className="truncate">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Varius quam quisque id diam vel quam elementum.
                </p>
              </div>
              <div className="col-span-1 mr-auto dark:text-gray-50 text-gray-700">
                <p>25m</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="col-start-5 col-span-5 xl:col-start-4 xl:col-span-7 flex-col grid grid-rows-3">
        <div className="row-span-2">
          <div className="bg-gradient-to-r from-blue-100 to-blue-400 font-medium text-3xl text-gray-800">
            <h1 className="p-3 ml-3">Nyannnnnnnnn</h1>
          </div>
          <div></div>
        </div>
        <div className="mt-auto mb-28 row-start-3 flex justify-center sm:px-3 xl:px-0">
          <a
            href=""
            className="text-gray-600 my-auto mr-4 transition hover:rotate-12"
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
          </a>
          <input
            className="w-5/6 rounded-full border-gray-300 focus:ring-0 focus:border-gray-300"
            type="text"
            placeholder="Type messages here..."
          />
          <a
            href=""
            className="text-blue-600 my-auto ml-4 rotate-90 transition hover:rotate-0 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="sm:col-start-10 xl:col-start-11 sm:col-span-3 xl:col-span-2 shadow-md shadow-gray-500 dark:shadow-slate-800">
        <div className="m-3">
          <ul className="flex space-x-2 justify-center">
            <li>
              <a href="">
                <img
                  className="rounded-md w-16 h-16 transition hover:-translate-y-1"
                  src="https://placekitten.com/200/222"
                  alt=""
                />
              </a>
            </li>
            <li>
              <a href="">
                <img
                  className="rounded-md w-16 h-16 transition hover:-translate-y-1"
                  src="https://placekitten.com/200/222"
                  alt=""
                />
              </a>
            </li>
            <li>
              <a href="">
                <img
                  className="rounded-md w-16 h-16 transition hover:-translate-y-1"
                  src="https://placekitten.com/200/222"
                  alt=""
                />
              </a>
            </li>
            <li>
              <a href="">
                <img
                  className="rounded-md w-16 h-16 transition hover:-translate-y-1"
                  src="https://placekitten.com/200/222"
                  alt=""
                />
              </a>
            </li>
          </ul>
          <a href="" className="text-center">
            <h1 className="font-semibold text-md text-blue-600 transition hover:underline">
              View shared file...
            </h1>
          </a>
        </div>
        <div className="grid grid-cols-2 content-center">
          <a
            href="#"
            className="col-span-1 py-4 text-center text-blue-600 text-md font-medium border-b-4 border-blue-700 flex group active"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 xl:ml-2 xl:mr-1 transition transform-gpu group-hover:scale-110 group-hover:-rotate-6 origin-bottom-right"
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
            Chat Members
          </a>
          <a
            href="#"
            className="col-span-1 py-4 text-center text-gray-600 text-md font-medium border-b-2 flex group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6  sm:ml-6 xl:ml-8 xl:mr-1 transition transform-gpu group-hover:rotate-180 z-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </a>
        </div>
      </div>
    </section>
  );
}

export default Message;
