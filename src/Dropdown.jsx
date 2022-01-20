import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ host, contents }) {
  return (
    <Menu as="div">
      <div>
        <Menu.Button>{host}</Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-1 top-16 mt-2 w-52 rounded-md shadow-lg bg-gray-50 dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 z-10">
            {contents.options.map((option, index) => {
              return (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm text-lg transition hover:underline hover:font-semibold dark:bg-slate-900 text-blue-600 dark:text-gray-300 dark:hover:text-gray-50"
                      )}
                    >
                      {option}
                    </a>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
