import { useState } from "react";
import Dropdown from "./Dropdown";

function Header() {
  return (
    <header className="bg-gray-50 dark:bg-slate-900 sticky shadow-sm dark:shadow-slate-800 z-50">
      <div className="grid grid-cols-4 py-2">
        <div className="col-span-1 my-auto ml-2 flex text-blue-500 dark:text-sky-300">
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
          <h3 className="my-auto ml-2 hidden sm:flex font-semibold text-md sm:text-2xl text-blue-600 dark:text-gray-50">
            Welcome to The Round Table!!!
          </h3>
        </div>
        <div className="col-span-3 flex justify-end">
          <div className="py-3 sm:mr-5 my-auto relative">
            <input
              className="h-10 w-32 sm:w-64 ml-2 pr-12 bg-gray-200 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-gray-50 rounded-md border-0 font-semibold transform duration-200 focus:w-44 sm:focus:w-96 focus:border-0 focus:ring-0 form-input"
              type="search"
              name="search"
              placeholder="Search"
            />
            <button className="absolute right-2 top-0 mt-5 text-gray-400 dark:text-gray-50 hover:text-gray-800 duration-200 hover:scale-105">
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
          <div className="my-auto mr-5">
            <ul className="col-span-1 flex space-x-5 text-xl font-semibold text-blue-600 dark:text-gray-300 hidden sm:flex">
              <li className="duration-100 hover:text-blue-500 dark:hover:text-gray-50 hover:scale-105">
                <a href="" className="flex group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transition group-hover:-rotate-6"
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
              <li className="duration-100 hover:text-blue-500 dark:hover:text-gray-50 hover:scale-105">
                <a href="" className="flex group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transition group-hover:-rotate-6"
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
          <div className="relative my-auto mr-3 py-2">
            <Dropdown
              host={function () {
                return (
                  <a
                    className="block p-1 rounded-full bg-blue-600 transition hover:scale-110 hover:bg-blue-400"
                    href=""
                  >
                    <img
                      className="shrink-0 w-12 h-12 rounded-full cursor-pointer object-cover"
                      src="https://placekitten.com/200/200"
                      alt=""
                    />
                  </a>
                );
              }}
              contents={{
                options: ["Account Settings", "Support", "Sign Out"],
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
