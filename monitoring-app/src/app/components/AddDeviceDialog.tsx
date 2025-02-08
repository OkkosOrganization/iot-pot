import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
} from "react";
import styles from "./AddDeviceDialog.module.css";
import { AddDevice } from "./actions";
import { Device } from "./Navi";
import { Xicon } from "./xicon";
import { Spinner } from "./Spinner";

type AddDeviceDialogProps = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  userId: number;
  setDevices: Dispatch<SetStateAction<Device[]>>;
};
const initialState = {
  device: [],
  error: null,
};

export const AddDeviceDialog = ({
  showDialog,
  setShowDialog,
  setDevices,
}: AddDeviceDialogProps) => {
  const [state, formAction, isPending] = useActionState(
    AddDevice,
    initialState
  );
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (state?.device?.length) {
      console.log("Add new device");
      setDevices((prev) => {
        const updatedDevices = [...prev].concat(
          state.device as unknown as Device
        );
        return updatedDevices;
      });
      dialogRef.current?.close();
      setShowDialog(false);
    }
  }, [state?.device, setDevices]);
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
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Title</label>
            <input
              type="text"
              name="title"
              className={styles.inputText}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            ADD DEVICE
          </button>
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
