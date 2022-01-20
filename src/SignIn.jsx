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
    <div className="min-h-screen grid place-items-center dark:bg-slate-900">
      <button
        className="px-2 py-3 dark:bg-indigo-700 text-2xl text-center font-medium text-gray-200 hover:text-gray-50 transition rounded-lg"
        onClick={signInWithGoggle}
      >
        Sign in with Google
      </button>
    </div>
  );
}
