import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This was the API key given by the firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZxGv-PsKnvXB4KMes7g3Jm4KmSPJQ0-U",
  authDomain: "mmt-react-55b91.firebaseapp.com",
  projectId: "mmt-react-55b91",
  storageBucket: "mmt-react-55b91.appspot.com",
  messagingSenderId: "1058130093473",
  appId: "1:1058130093473:web:bb20e3623051b0ccf097e0",
  measurementId: "G-7T5Y1R98V7",
};

//fireDb variable is then used to get the Firestore instance for the app.
// This fireDb and app variables are then exported for use in other parts of the application.

const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);

export { fireDb, app };
