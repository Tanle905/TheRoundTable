import { useState } from "react";
import Dropdown from "./Dropdown";

function Header() {
  return (
    <header className="bg-gray-50 sticky shadow-sm">
      <div className="grid grid-cols-4">
        <div className="col-span-1 my-auto ml-2 flex text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
                <h3 className="my-auto hidden sm:flex font-bold text-md sm:text-2xl text-blue-500">Welcome to The Round Table!!!</h3>
        </div>
        <div className="col-span-3 flex justify-end">
          <div className="py-3 sm:mr-5 my-auto relative">
            <input
              className="h-10 w-28 sm:w-64 ml-2 border-2 border-gray-400 rounded-2xl font-semibold transform duration-200 focus:w-48 sm:focus:w-96"
              type="search"
              name="search"
              placeholder="Search"
            />
            <button className="absolute right-2 top-0 mt-5 text-gray-600 hover:text-gray-800 duration-200 hover:scale-105">
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
            <ul className="col-span-1 flex space-x-5 text-xl font-semibold text-blue-600 hidden sm:flex">
              <li className="duration-100 hover:text-blue-800 hover:scale-105">
                <a href="">Chat</a>
              </li>
              <li className="duration-100 hover:text-blue-800 hover:scale-105">
                <a href="">Workspace</a>
              </li>
            </ul>
          </div>
          <div className="my-auto mr-3 py-3">
          <Dropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
