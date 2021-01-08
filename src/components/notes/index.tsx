import { Button, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";

export interface INote {
  id: string;
  title: string;
  text: string;
  createdOn: number;
}

interface Props {
  notes: INote[];
  editHandler: (id: string) => void;
  deleteHandler: (id: string) => void;
  deleteLoadingStatus: boolean;
}

export function Notes(props: Props) {
  function renderNotes() {
    return props.notes.map((note) => {
      return (
        <li key={note.id}>
          <div>
            <Typography variant="subtitle2">{note.title}</Typography>
            <Typography variant="body1">{note.text}</Typography>
            <Button onClick={() => props.editHandler(note.id)}>Edit</Button>
            <Button
              onClick={() => props.deleteHandler(note.id)}
              disabled={props.deleteLoadingStatus}
            >
              Delete
            </Button>
            <Typography variant="subtitle2">
              {moment(note.createdOn).fromNow()}
            </Typography>
          </div>
        </li>
      );
    });
  }

  return <div>{renderNotes()}</div>;
}
