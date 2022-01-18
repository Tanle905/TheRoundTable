function Message() {
  return (
    <section className="min-h-screen bg-slate-100 dark:bg-slate-900 grid grid-cols-12">
      <div className="col-start-1 col-span-3  shadow-md shadow-gray-500 dark:shadow-slate-800">
        <div className="p-8 flex">
          <h1 className="font-bold my-auto text-gray-800 dark:text-gray-50 text-2xl">Chats</h1>
          <div className="py-3 my-auto ml-auto sm:mr-5 relative">
            <input
              className="h-10 w-10 ml-2 bg-gray-100 hover:bg-gray-300 dark:hover:bg-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 hover:w-56"
              type="search"
              name="search"
              placeholder="Search"
            />
            <button className="absolute right-2 top-0 mt-5 text-gray-600 dark:text-gray-50 hover:text-gray-800 duration-200 hover:scale-105">
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
            <button className="my-auto text-gray-600 dark:text-gray-50 ml-2">
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
        <ul className="px-5">
          <li className="">
          <div className="flex p-3 space-x-5 grid grid-cols-6 rounded-lg transition-all focus:bg-gray-200 hover:cursor-pointer">
            <a href="" className="col-span-1">
              <img
                className="w-16 h-16 rounded-full transition hover:ring-4 ring-blue-600"
                src="https://placekitten.com/200/200"
                alt=""
              />
            </a>
            <div className="flex-col truncate col-span-4 text-gray-800 dark:text-gray-50">
              <h1 className="font-bold text-xl">Nyannnnnnnnn</h1>
              <p className="truncate">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
    </section>
  );
}

export default Message;
