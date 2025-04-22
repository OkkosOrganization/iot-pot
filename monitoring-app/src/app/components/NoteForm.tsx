"use client";
import { MouseEvent, useRef, useState } from "react";
import updateLocale from "dayjs/plugin/updateLocale";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import styles from "./NoteForm.module.css";
import { ImageIcon } from "./icons/ImageIcon";
import { Xicon } from "./icons/xicon";
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
  const [image, setImage] = useState<string>("");
  const imageRef = useRef<HTMLInputElement | null>(null);
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
          image: image,
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
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resizeAndConvertToJpeg(result)
        .then((jpegBase64) => setImage(jpegBase64))
        .catch((err) => console.error("Conversion failed", err));
    };
    reader.readAsDataURL(file);
  };

  const resizeAndConvertToJpeg = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const maxDim = 800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            width = maxDim;
            height = Math.round(maxDim / aspectRatio);
          } else {
            height = maxDim;
            width = Math.round(maxDim * aspectRatio);
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context not available");

        ctx.drawImage(img, 0, 0, width, height);

        const jpegBase64 = canvas.toDataURL("image/jpeg", 0.9);
        resolve(jpegBase64);
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
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
            <div className={styles.imageInputContainer}>
              <input
                type="file"
                accept="image/*"
                className={styles.hidden}
                ref={imageRef}
                onChange={handleImage}
              ></input>

              <button
                className={`btn ${styles.imageBtn}`}
                onClick={() => imageRef?.current?.click()}
              >
                <span className={styles.imageIcon}>
                  <ImageIcon />
                </span>
                <span>Add Image</span>
              </button>
            </div>
            {image ? (
              <div className={styles.imageContainer}>
                <img src={`${image}`} />
                <button
                  className={styles.removeImageBtn}
                  onClick={() => setImage("")}
                >
                  <Xicon />
                </button>
              </div>
            ) : null}
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
