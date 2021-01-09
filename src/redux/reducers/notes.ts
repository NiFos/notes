import { ThunkAction } from "redux-thunk";
import { NoteData } from "../../components/modals/note-modal";
import { INote } from "../../components/notes";
import {
  createNote,
  deleteNote,
  editNote,
  getUserNotes,
} from "../../lib/firebase";
import { RootState } from "../store";

export const notesReducerTypes = {
  getNotes: "notes/GET_NOTES",
  getNotesStatus: "notes/GET_NOTES_STATUS",
  setCurrentNote: "notes/SET_CURRENT_NOTE",
  createNote: "notes/CREATE_NOTE",
  createNoteStatus: "notes/CREATE_NOTE_STATUS",
  editNote: "notes/EDIT_NOTE",
  editNoteStatus: "notes/EDIT_NOTE_STATUS",
  deleteNote: "notes/DELETE_NOTE",
  deleteNoteStatus: "notes/DELETE_NOTE_STATUS",
  changeSorting: "notes/CHANGE_SORTING",
};

export interface INotesReducer {
  notes: INote[];
  currentNote: string;
  sortingAsc: boolean;
  notesStatus: "none" | "loading" | "loaded" | "error";
  createNoteStatus: "none" | "loading" | "loaded" | "error";
  deleteNoteStatus: "none" | "loading" | "loaded" | "error";
  editNoteStatus: "none" | "loading" | "loaded" | "error";
}

const initialState: INotesReducer = {
  notes: [],
  currentNote: "",
  sortingAsc: false,
  notesStatus: "none",
  createNoteStatus: "none",
  deleteNoteStatus: "none",
  editNoteStatus: "none",
};

export const notesReducer = (
  state = initialState,
  { type, payload }: NotesAction
): INotesReducer => {
  switch (type) {
    case notesReducerTypes.getNotes: {
      return {
        ...state,
        notes: payload as INotesReducer["notes"],
      };
    }

    case notesReducerTypes.getNotesStatus: {
      return {
        ...state,
        notesStatus: payload as INotesReducer["notesStatus"],
      };
    }

    case notesReducerTypes.createNoteStatus: {
      return {
        ...state,
        createNoteStatus: payload as INotesReducer["createNoteStatus"],
      };
    }

    case notesReducerTypes.deleteNoteStatus: {
      return {
        ...state,
        deleteNoteStatus: payload as INotesReducer["deleteNoteStatus"],
      };
    }

    case notesReducerTypes.editNoteStatus: {
      return {
        ...state,
        editNoteStatus: payload as INotesReducer["editNoteStatus"],
      };
    }

    case notesReducerTypes.createNote: {
      return {
        ...state,
        notes: [...state.notes, payload as INote],
      };
    }

    case notesReducerTypes.deleteNote: {
      const newNotes = [...state.notes];
      const id = newNotes.findIndex((item) => item.id === (payload as string));
      newNotes.splice(id, 1);
      return {
        ...state,
        notes: newNotes,
      };
    }

    case notesReducerTypes.editNote: {
      const newNotes = [...state.notes];
      const payloadData = payload as EditNoteData;
      const id = newNotes.findIndex((item) => item.id === payloadData.id);
      newNotes[id] = {
        ...newNotes[id],
        ...payloadData,
      };
      return {
        ...state,
        notes: [...newNotes],
      };
    }

    case notesReducerTypes.setCurrentNote: {
      return {
        ...state,
        currentNote: payload as INotesReducer["currentNote"],
      };
    }

    case notesReducerTypes.changeSorting: {
      return {
        ...state,
        sortingAsc: payload as INotesReducer["sortingAsc"],
      };
    }

    default: {
      return state;
    }
  }
};

interface GetNotesActions {
  type: typeof notesReducerTypes.getNotes;
  payload: INotesReducer["notes"];
}
interface GetNotesStatusActions {
  type: typeof notesReducerTypes.getNotesStatus;
  payload: INotesReducer["notesStatus"];
}
export const getNotes = (
  userId: string,
  asc?: boolean
): ThunkAction<void, RootState, unknown, NotesAction> => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const sorting = typeof asc === "boolean" ? asc : state.notes.sortingAsc;
    const response = await getUserNotes(userId, sorting);
    dispatch({
      type: notesReducerTypes.getNotesStatus,
      payload: "loaded",
    });
    dispatch({
      type: notesReducerTypes.getNotes,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: notesReducerTypes.getNotesStatus,
      payload: "error",
    });
    dispatch({
      type: notesReducerTypes.getNotes,
      payload: [],
    });
  }
};

interface SetCurrentNoteAction {
  type: typeof notesReducerTypes.setCurrentNote;
  payload: INotesReducer["currentNote"];
}

export const setCurrentNote = (noteId: string): SetCurrentNoteAction => {
  return {
    type: notesReducerTypes.setCurrentNote,
    payload: noteId,
  };
};

interface ChangeSortingAction {
  type: typeof notesReducerTypes.changeSorting;
  payload: INotesReducer["sortingAsc"];
}

export const changeSorting = (
  asc: boolean
): ThunkAction<void, RootState, unknown, NotesAction> => async (
  dispatch,
  getState
) => {
  dispatch({
    type: notesReducerTypes.changeSorting,
    payload: asc,
  });
  const state = getState();
  const user = state.auth.user;
  dispatch(getNotes(user, asc));
};

interface CreateNoteStatusAction {
  type: typeof notesReducerTypes.createNoteStatus;
  payload: INotesReducer["createNoteStatus"];
}

interface CreateNoteAction {
  type: typeof notesReducerTypes.createNote;
  payload: INote;
}
export const createUserNote = (
  userId: string,
  noteData: NoteData
): ThunkAction<void, RootState, unknown, NotesAction> => async (dispatch) => {
  try {
    dispatch({
      type: notesReducerTypes.createNoteStatus,
      payload: "loading",
    });
    const response = await createNote(userId, noteData);
    const data = {
      createdOn: Date.now(),
      id: response,
      title: noteData.title,
      text: noteData.text,
    };
    dispatch({
      type: notesReducerTypes.createNote,
      payload: data,
    });
    dispatch({
      type: notesReducerTypes.createNoteStatus,
      payload: "loaded",
    });
  } catch (error) {
    dispatch({
      type: notesReducerTypes.createNoteStatus,
      payload: "error",
    });
  }
};

interface DeleteNoteStatusAction {
  type: typeof notesReducerTypes.deleteNoteStatus;
  payload: INotesReducer["deleteNoteStatus"];
}

interface DeleteNoteAction {
  type: typeof notesReducerTypes.deleteNote;
  payload: string;
}
export const deleteUserNote = (
  userId: string,
  noteId: string
): ThunkAction<void, RootState, unknown, NotesAction> => async (dispatch) => {
  try {
    dispatch({
      type: notesReducerTypes.deleteNoteStatus,
      payload: "loading",
    });
    const response = await deleteNote(userId, noteId);
    dispatch({
      type: notesReducerTypes.deleteNote,
      payload: response,
    });
    dispatch({
      type: notesReducerTypes.deleteNoteStatus,
      payload: "loaded",
    });
  } catch (error) {
    dispatch({
      type: notesReducerTypes.deleteNoteStatus,
      payload: "error",
    });
  }
};

interface EditNoteStatusAction {
  type: typeof notesReducerTypes.editNoteStatus;
  payload: INotesReducer["editNoteStatus"];
}

interface EditNoteData {
  id: string;
  title: string;
  text: string;
}
interface EditNoteAction {
  type: typeof notesReducerTypes.editNote;
  payload: EditNoteData;
}
export const editUserNote = (
  userId: string,
  noteId: string,
  noteData: NoteData
): ThunkAction<void, RootState, unknown, NotesAction> => async (dispatch) => {
  try {
    dispatch({
      type: notesReducerTypes.editNoteStatus,
      payload: "loading",
    });
    const response = await editNote(userId, noteId, noteData);
    dispatch({
      type: notesReducerTypes.editNote,
      payload: {
        id: response,
        title: noteData.title,
        text: noteData.text,
      },
    });
    dispatch({
      type: notesReducerTypes.editNoteStatus,
      payload: "loaded",
    });
  } catch (error) {
    dispatch({
      type: notesReducerTypes.editNoteStatus,
      payload: "error",
    });
  }
};

export type NotesAction =
  | GetNotesStatusActions
  | GetNotesActions
  | SetCurrentNoteAction
  | CreateNoteAction
  | CreateNoteStatusAction
  | EditNoteStatusAction
  | EditNoteAction
  | DeleteNoteStatusAction
  | DeleteNoteAction
  | ChangeSortingAction;
