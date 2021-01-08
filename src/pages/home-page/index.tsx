/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NoteData, NoteModal } from "../../components/modals/note-modal";
import { Notes } from "../../components/notes";
import {
  createUserNote,
  deleteUserNote,
  editUserNote,
  getNotes,
  setCurrentNote,
} from "../../redux/reducers/notes";
import { RootState } from "../../redux/store";

interface Props {}

export function Home(props: Props) {
  const userState = useSelector((state: RootState) => state.auth);
  const state = useSelector((state: RootState) => state.notes);
  const dispatch = useDispatch();
  const [openNewNote, setOpenNewNote] = React.useState(false);

  React.useEffect(() => {
    dispatch(getNotes(userState.user));
  }, []);

  function editHandler(noteId: string) {
    dispatch(setCurrentNote(noteId));
  }

  function closeHandler() {
    setOpenNewNote(false);
    dispatch(setCurrentNote(""));
  }

  function submitHandler(noteData: NoteData) {
    if (openNewNote) {
      dispatch(createUserNote(userState.user, noteData));
    } else {
      dispatch(editUserNote(userState.user, state.currentNote, noteData));
    }
    closeHandler();
  }

  function deleteHandler(noteId: string) {
    dispatch(deleteUserNote(userState.user, noteId));
  }

  return (
    <div>
      {(state.currentNote || openNewNote) && (
        <NoteModal
          open={openNewNote || !!state.currentNote}
          onClose={closeHandler}
          submitHandler={submitHandler}
          isNew={openNewNote}
          note={state.notes.find((item) => item.id === state.currentNote)}
          submitLoadingStatus={
            state.createNoteStatus === "loading" ||
            state.editNoteStatus === "loading"
          }
        />
      )}
      <Button onClick={() => setOpenNewNote(!openNewNote)}>New note</Button>
      <Notes
        notes={state.notes}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        deleteLoadingStatus={state.deleteNoteStatus === "loading"}
      />
    </div>
  );
}
