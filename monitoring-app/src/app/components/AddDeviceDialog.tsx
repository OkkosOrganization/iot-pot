import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
} from "react";
import styles from "./AddDeviceDialog.module.css";
import { Xicon } from "./icons/xicon";
import { Spinner } from "./Spinner";
import { User } from "../../types";
import { AddDevice } from "../../actions";
import { useExtendedUserContext } from "@/contexts/extendedUserContext";

type AddDeviceDialogProps = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
};
const initialState = {
  device: [],
  error: null,
};

export const AddDeviceDialog = ({
  showDialog,
  setShowDialog,
}: AddDeviceDialogProps) => {
  const { user, setUser } = useExtendedUserContext();
  const [state, formAction, isPending] = useActionState(
    AddDevice,
    initialState
  );
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (state?.device?.length) {
      console.log("Add new device");
      const updatedUser = { ...user };
      updatedUser.db?.devices.push(state.device[0]);
      setUser(updatedUser as User);
      dialogRef.current?.close();
      setShowDialog(false);
    }
  }, [state?.device, setUser, setShowDialog]);
  return (
    <dialog open={showDialog} className={styles.dialog} ref={dialogRef}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Add new device</h2>
          <button
            className={styles.closeDialogBtn}
            onClick={() => {
              dialogRef.current?.close();
              setShowDialog(false);
            }}
          >
            <Xicon />
          </button>
        </header>
        <form action={formAction} className={styles.form}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Device ID</label>
            <input
              type="text"
              name="deviceId"
              className={styles.inputText}
              required
              maxLength={128}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Title</label>
            <input
              type="text"
              name="title"
              className={styles.inputText}
              required
              maxLength={128}
            />
          </div>
          <div className={styles.bottom}>
            <p className={styles.error}>{state?.error as string}</p>
            <button type="submit" className={styles.submitBtn}>
              ADD DEVICE
            </button>
          </div>
        </form>
        {isPending ? (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        ) : null}
      </div>
    </dialog>
  );
};
