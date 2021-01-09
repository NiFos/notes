import firebase from "firebase";
import { NoteData } from "../components/modals/note-modal";
import { INote } from "../components/notes";

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
    return response.user?.uid || "";
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
    return response.user?.uid || "";
  } catch (error) {
    return "";
  }
}

export async function createNote(
  userId: string,
  noteData: NoteData
): Promise<string> {
  try {
    const data = {
      ...noteData,
      createdOn: Date.now(),
    };
    const response = await firebase
      .firestore()
      .collection("notes")
      .doc(userId)
      .collection("userNotes")
      .add(data);
    return response.id;
  } catch (error) {
    return "";
  }
}

export async function deleteNote(
  userId: string,
  noteId: string
): Promise<string> {
  try {
    await firebase
      .firestore()
      .collection("notes")
      .doc(userId)
      .collection("userNotes")
      .doc(noteId)
      .delete();
    return noteId;
  } catch (error) {
    return "";
  }
}

export async function editNote(
  userId: string,
  noteId: string,
  noteData: NoteData
): Promise<string> {
  try {
    await firebase
      .firestore()
      .collection("notes")
      .doc(userId)
      .collection("userNotes")
      .doc(noteId)
      .update({
        title: noteData.title,
        text: noteData.text,
      });
    return noteId;
  } catch (error) {
    return "";
  }
}

export async function getUserNotes(
  userId: string,
  sorting: boolean
): Promise<INote[]> {
  try {
    const response = await firebase
      .firestore()
      .collection("notes")
      .doc(userId)
      .collection("userNotes")
      .orderBy("createdOn", sorting ? "asc" : "desc")
      .get();
    return response.docs.map((item) => {
      const itemData = item.data();
      return {
        title: itemData.title,
        createdOn: itemData.createdOn,
        id: item.id,
        text: itemData.text,
      };
    });
  } catch (error) {
    return [];
  }
}

export function currentUser(): string {
  return "";
}
