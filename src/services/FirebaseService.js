import { initializeApp } from 'firebase/app';

class FirebaseApp {
    static init() {
        console.log("6tyy6h");
        const initialize =  initializeApp({
            apiKey: "AIzaSyBa68wqeX9-ztnkex7aIT1Xs9eXplNG7qk",
            authDomain: "the-round-table-ffc3f.firebaseapp.com",
            projectId: "the-round-table-ffc3f",
            storageBucket: "the-round-table-ffc3f.appspot.com",
            messagingSenderId: "551826854387",
            appId: "1:551826854387:web:7cdd75b6cbc985bc274286",
            measurementId: "G-3NRE8RWMTD",
          });
        return initialize;
    }
}

export default FirebaseApp;