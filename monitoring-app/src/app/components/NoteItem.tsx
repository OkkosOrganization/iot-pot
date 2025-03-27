import { Note } from "@/types";
import dayjs from "dayjs";
import styles from "./NoteItem.module.css";

type NoteItemProps = {
  note: Note;
};
export const NoteItem = ({ note }: NoteItemProps) => {
  const d = dayjs(note.date);
  return (
    <div key={note?.id} className={styles.container}>
      <div className={styles.top}>
        <h3 className={styles.title}>{note.title}</h3>
        <div className={styles.date}>
          {d.date()}.{d.month()}.{d.year()} - {d.hour()}:{d.minute()}
        </div>
      </div>

      <div>{note.content}</div>
    </div>
  );
};
