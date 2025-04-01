import { Dispatch, SetStateAction, useRef } from "react";
import styles from "./SensorInfoDialog.module.css";
import { Xicon } from "./icons/xicon";

type SensorInfoDialogProps = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
};

export const SensorInfoDialog = ({
  showDialog,
  setShowDialog,
}: SensorInfoDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  return (
    <dialog open={showDialog} className={styles.dialog} ref={dialogRef}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Sensor value info</h2>
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
        <div className={styles.content}>
          <h3>Soil moisture</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            turpis quam, cursus nec aliquam vel, imperdiet ut magna. Donec metus
            ex, tempus vehicula eleifend eu, fringilla sed lacus. Cras ante
            metus, laoreet sed eleifend vel, porta sed risus. Sed nec eros nisi.
            Nulla vitae tincidunt diam. Proin interdum porttitor dui, at mattis
            arcu fermentum at. Nunc dictum tellus convallis varius ornare.
            Quisque eu leo a nulla lobortis ullamcorper. Morbi gravida, sapien
            ac sodales rutrum, massa purus aliquet risus, ac pharetra diam nisi
            eget felis. Suspendisse nec sodales libero. Mauris pharetra urna sit
            amet ullamcorper lacinia. Aliquam erat volutpat. Aenean ac nisl
            justo.
          </p>

          <h3>Soil PH</h3>
          <p>
            Curabitur accumsan pulvinar lobortis. Integer posuere ante a sem
            tincidunt, et tristique augue eleifend. Nulla sed elit condimentum,
            vestibulum dolor ac, sodales neque. Donec dictum mi a nisl ornare
            sagittis. Fusce consequat eleifend odio, quis varius libero
            consectetur sit amet. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Pellentesque habitant morbi tristique senectus et
            netus et malesuada fames ac turpis egestas. Nunc libero libero,
            sagittis id gravida nec, ornare at diam. Donec tincidunt lacus
            felis, at consequat diam ullamcorper in.
          </p>

          <h3>Soil temperature</h3>
          <p>
            Aenean sit amet aliquam lectus. Duis venenatis facilisis justo sed
            lacinia. Sed ultrices sem ac elit malesuada, sed sodales erat
            accumsan. Curabitur quis diam eu sem commodo eleifend. Ut justo
            ligula, tristique at volutpat sit amet, commodo quis purus. Ut
            accumsan felis eget mi molestie, at semper diam fringilla. Etiam
            ultrices dui vitae ornare viverra. Etiam id lacus vitae diam posuere
            efficitur. Suspendisse potenti. Aliquam sed lacus sed diam congue
            luctus. Phasellus lacinia arcu in leo dapibus laoreet. Donec nec
            velit aliquet, euismod ante non, tincidunt dolor.
          </p>

          <h3>Water level</h3>
          <p>
            Nulla at libero et eros gravida facilisis et at nunc. Quisque porta
            ante at arcu ultricies lobortis. Fusce id libero sit amet turpis
            tempus lobortis et nec libero. Vestibulum maximus turpis in luctus
            pellentesque. Fusce commodo massa quis metus venenatis mattis.
            Praesent sed finibus tortor. Nam nulla nunc, accumsan rutrum risus
            in, varius varius quam. Vestibulum feugiat congue scelerisque.
            Vestibulum et finibus orci.
          </p>
        </div>
      </div>
    </dialog>
  );
};
