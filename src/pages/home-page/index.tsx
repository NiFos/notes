/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NoteData, NoteModal } from "../../components/modals/note-modal";
import { Notes } from "../../components/notes";
import {
  changeSorting,
  createUserNote,
  deleteUserNote,
  editUserNote,
  getNotes,
  setCurrentNote,
} from "../../redux/reducers/notes";
import { RootState } from "../../redux/store";

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

interface Props {}

export function Home(props: Props) {
  const userState = useSelector((state: RootState) => state.auth);
  const state = useSelector((state: RootState) => state.notes);
  const dispatch = useDispatch();
  const [openNewNote, setOpenNewNote] = React.useState(false);
  const classes = useStyles();

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
      <div className={classes.header}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenNewNote(!openNewNote)}
        >
          New note
        </Button>
        <Button onClick={() => dispatch(changeSorting(!state.sortingAsc))}>
          Sorting: {state.sortingAsc ? "ascending" : "descending"}
        </Button>
      </div>
      {state.notesStatus === "loaded" ? (
        <Notes
          notes={state.notes}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          deleteLoadingStatus={state.deleteNoteStatus === "loading"}
        />
      ) : state.notesStatus === "loading" ? (
        <CircularProgress />
      ) : state.notesStatus === "error" ? (
        <div>Something went error</div>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </div>
  );
}
