"use client";
import { MouseEvent, useState } from "react";
import updateLocale from "dayjs/plugin/updateLocale";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import styles from "./NoteForm.module.css";
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

type NoteFormProps = {
  deviceId: string;
};
export const NoteForm = ({ deviceId }: NoteFormProps) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [date, setDate] = useState<Dayjs>(dayjs(Date.now()));
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const postNote = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // SIMPLE VALIDATION
    if (!title.trim().length || !content.trim().length)
      return setError("Please fill in the note title and content ");

    try {
      const response = await fetch(`/api/note/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          deviceId: deviceId,
          date: date,
        }),
      });
      console.log(response);
      if (response.ok) {
        console.log("OK");
        setTitle("");
        setContent("");
        setError("");
        setSuccess("Note added ✅");
      } else {
        const body = await response.json();

        if (body?.success === 0) {
          console.log(body);
          setError(`${body.error}`);
          setSuccess("");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error");
      setSuccess("");
    }
  };
  return (
    <>
      <h2 className={styles.title}>Add note</h2>
      <div className={styles.notesContainer}>
        <form className={styles.form}>
          <div className={styles.side}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Title</label>
              <input
                onChange={(e) => setTitle(e.currentTarget.value)}
                value={title}
                type="text"
                required
                maxLength={256}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Note content</label>
              <textarea
                rows={3}
                value={content}
                required
                onChange={(e) => setContent(e.currentTarget.value)}
              ></textarea>
            </div>
            <div className={styles.bottom}>
              {error ? <p className={styles.error}>{`${error} ❌`}</p> : null}
              {success ? <p className={styles.success}>{success}</p> : null}
              <button className="btn" onClick={postNote}>
                submit
              </button>
            </div>
          </div>
          <div className={styles.date}>
            <DateCalendar
              views={["day", "month", "year"]}
              maxDate={dayjs(Date.now())}
              value={date}
              onChange={(value) => {
                const date = dayjs(value);
                setDate(date);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
};
