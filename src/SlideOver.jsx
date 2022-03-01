import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function SlideOver({ content, state, setState }) {
  return (
    <Transition.Root show={state} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setState}
        initialFocus={null}
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
            <Dialog.Overlay className="absolute inset-0 dark:bg-slate-800/75 backdrop-blur-lg transition-opacity" />
          </Transition.Child>
          <div className="fixed top-10 sm:top-14 inset-y-0 left-0 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="-translate-x-full"
              enterTo="-translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="-translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative w-screen max-w-xs sm:max-w-md">
                <div className="h-full flex flex-col py-5 bg-gray-50 dark:bg-slate-900 shadow-xl">
                  {content}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
