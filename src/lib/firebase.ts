import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(config);

export async function registerUser(
  email: string,
  password: string
): Promise<string> {
  try {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return response.user?.email || "";
  } catch (error) {
    return "";
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return response.user?.email || "";
  } catch (error) {
    return "";
  }
}

export function currentUser(): string {
  return "";
}
