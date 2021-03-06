import { Button, Checkbox, Input, makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { minLength, validateEmail } from "../../lib/validation";
import { auth } from "../../redux/reducers/auth";
import { RootState } from "../../redux/store";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  label: {
    marginRight: theme.spacing(1),
  },
  btn: {
    marginTop: theme.spacing(1),
  },
}));

interface Props {}

interface IFormData {
  email: {
    valid: boolean;
    touched: boolean;
    value: string;
  };
  password: {
    valid: boolean;
    touched: boolean;
    value: string;
  };
}
const formData: IFormData = {
  email: {
    touched: false,
    valid: false,
    value: "",
  },
  password: {
    touched: false,
    valid: false,
    value: "",
  },
};

export function Auth(props: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.auth);
  const [isReg, setIsReg] = React.useState(false);
  const [formState, setFormState] = React.useState<IFormData>(formData);

  function changeHandler(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const valid =
      e.target.name === "email"
        ? validateEmail(e.target.value)
        : minLength(e.target.value, 6);
    setFormState({
      ...formState,
      [e.target.name]: {
        value: e.target.value,
        touched: true,
        valid,
      },
    });
  }

  function submitHandler() {
    dispatch(auth(formState.email.value, formState.password.value, isReg));
  }

  return (
    <div className={classes.root}>
      <div>
        <label htmlFor="isReg">I want to register</label>
        <Checkbox id="isReg" value={isReg} onChange={() => setIsReg(!isReg)} />
      </div>
      <div>
        <label className={classes.label} htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          value={formState.email.value}
          onChange={(e) => changeHandler(e)}
        />
      </div>
      <div>
        <label className={classes.label} htmlFor="password">
          Password
        </label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formState.password.value}
          onChange={(e) => changeHandler(e)}
        />
      </div>
      <Button
        className={classes.btn}
        color="primary"
        variant="contained"
        disabled={state.authStatus === "loading"}
        onClick={submitHandler}
      >
        {isReg ? "Register" : "Login"}
      </Button>
    </div>
  );
}
