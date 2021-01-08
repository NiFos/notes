import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TextField,
} from "@material-ui/core";
import React from "react";
import { INote } from "../notes";

interface Props {
  open: boolean;
  onClose: () => void;
  submitHandler: (noteData: NoteData) => void;
  submitLoadingStatus: boolean;
  isNew: boolean;
  note?: INote;
}

export function NoteModal(props: Props) {
  const [noteData, setNoteData] = React.useState<NoteData>(
    props.isNew
      ? initialNote
      : { title: props.note?.title || "", text: props.note?.text || "" }
  );

  function editHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        <Input
          name="title"
          value={noteData.title}
          onChange={editHandler}
          placeholder={"Note title"}
        />
      </DialogTitle>
      <DialogContent>
        <TextField
          name="text"
          value={noteData.text}
          onChange={editHandler}
          multiline
          placeholder={"Note content"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          disabled={props.submitLoadingStatus}
          onClick={() => props.submitHandler(noteData)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface NoteData {
  title: string;
  text: string;
}
const initialNote: NoteData = {
  title: "New note",
  text: "",
};
