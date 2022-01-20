import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export default function SignIn() {
  const auth = firebase.auth();
  
  const signInWithGoggle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 dark:bg-slate-900">
      <button
        className="px-2 py-3 text-gray-100 bg-blue-600 dark:bg-indigo-700 text-2xl text-center font-medium text-gray-200 hover:text-gray-50 hover:bg-blue-500 dark:hover:bg-indigo-600 hover:-translate-y-1 transition rounded-lg"
        onClick={signInWithGoggle}
      >
        Sign in with Google
      </button>
    </div>
  );
}
