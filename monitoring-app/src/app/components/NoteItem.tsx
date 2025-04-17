import { Note } from "@/types";
import dayjs from "dayjs";
import styles from "./NoteItem.module.css";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

type NoteItemProps = {
  note: Note;
};
export const NoteItem = ({ note }: NoteItemProps) => {
  const d = dayjs.utc(note.date).tz("Europe/Helsinki");

  return (
    <div key={note?.id} className={styles.container}>
      <div className={styles.top}>
        <h3 className={styles.title}>{note.title}</h3>
        <div className={styles.date}>
          <span>{d.format("DD.MM.YYYY")}</span>
          <span>{d.format("HH:mm")}</span>
        </div>
      </div>

      <div>{note.content}</div>
    </div>
  );
};
