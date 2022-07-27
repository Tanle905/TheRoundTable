import firebase from "firebase/compat/app";
import GoogleIco from "../../svg/google_ico.svg";
import { useContext } from "react";
import { AuthContext } from "../App";

export default function SignIn() {
  const { auth } = useContext(AuthContext);
  
  function signInWithGoggle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="flex min-h-screen justify-center space-y-3 bg-gray-100 dark:bg-slate-900">
      <div className="my-auto flex w-72 flex-col space-y-5">
        <button
          className="flex rounded-md bg-blue-600 px-2 py-3 text-2xl font-medium text-gray-100 transition hover:-translate-y-1 hover:bg-blue-500 hover:text-gray-50 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          onClick={signInWithGoggle}
        >
          <img
            src={GoogleIco}
            alt=""
            className="mr-2 h-10 w-10 rounded-md bg-gray-200 p-1 text-center "
          />
          <p className="text-center"> Sign in with Google</p>
        </button>
      </div>
    </div>
  );
}
