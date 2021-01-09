import { Button, makeStyles, Typography } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  note: {
    marginBottom: theme.spacing(2),
  },
}));

export function Notes(props: Props) {
  const classes = useStyles();

  function renderNotes() {
    return props.notes.map((note) => {
      return (
        <div key={note.id} className={classes.note}>
          <div>
            <Typography variant="subtitle2">{note.title}</Typography>
            <Typography variant="body1">{note.text}</Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={() => props.editHandler(note.id)}
            >
              Edit
            </Button>
            <Button
              variant="text"
              onClick={() => props.deleteHandler(note.id)}
              disabled={props.deleteLoadingStatus}
            >
              Delete
            </Button>
            <Typography variant="subtitle2">
              {moment(note.createdOn).fromNow()}
            </Typography>
          </div>
        </div>
      );
    });
  }

  return <div>{renderNotes()}</div>;
}
