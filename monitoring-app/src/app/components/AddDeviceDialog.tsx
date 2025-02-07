import { Dispatch, SetStateAction } from "react";
import styles from "./AddDeviceDialog.module.css";
type AddDeviceDialogProps = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
};
export const AddDeviceDialog = ({
  showDialog,
  setShowDialog,
}: AddDeviceDialogProps) => {
  return (
    <dialog open={showDialog} className={styles.dialog}>
      <div className={styles.container}>
        <p>Lisää laite</p>
        <button
          className={styles.closeDialogBtn}
          onClick={() => setShowDialog(false)}
        >
          X
        </button>
      </div>
    </dialog>
  );
};
