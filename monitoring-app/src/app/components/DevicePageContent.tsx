"use client";
import { useMqttContext } from "@/contexts/mqttContext";
import { SensorCard } from "./SensorCard";
import styles from "./DevicePageContent.module.css";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MouseEvent, useState } from "react";

type DevicePageContentProps = {
  deviceId: string;
};
export const DevicePageContent = ({ deviceId }: DevicePageContentProps) => {
  const {
    airTemperature,
    airHumidity,
    soilMoisture,
    soilPh,
    soilTemperature,
    luminosity,
    waterLevel,
    waterOverflow,
  } = useMqttContext();
  const [error, setError] = useState<string>("");
  const [date, setDate] = useState<Dayjs>(dayjs(Date.now()));
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const postNote = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/note/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          deviceId: deviceId,
          date: date,
        }),
      });
      if (response.ok) {
        setTitle("");
        setContent("");
        setError("");
      } else {
        const body = await response.json();

        if (body?.success === 0) {
          console.log(body);
          setError(body.error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <SensorCard
          type="soilMoisture"
          title="Soil Moisture"
          value={soilMoisture as number}
          unit="%"
        />
        <SensorCard
          type="soilPh"
          title="Soil PH"
          value={soilPh as number}
          unit="%"
        />
        <SensorCard
          type="soilTemperature"
          title="Soil Temperature"
          value={soilTemperature as number}
          unit="°C"
        />
        <SensorCard
          type="waterLevel"
          title="Water Level"
          value={waterLevel}
          unit="%"
        />
        <SensorCard
          type="luminosity"
          title="Luminosity"
          value={luminosity as number}
          unit="LUX"
        />
        <SensorCard
          type="airTemperature"
          title="Air Temperature"
          value={airTemperature as number}
          unit="°C"
        />
        <SensorCard
          type="airHumidity"
          title="Air Humidity"
          value={airHumidity as number}
          unit="%"
        />
        <SensorCard
          type="waterOverflow"
          title="Water Overflow"
          value={waterOverflow}
          unit=""
        />
      </div>
      <h2 className={styles.title}>Add note</h2>
      <div className={styles.notesContainer}>
        <form className={styles.form}>
          <div className={styles.side}>
            <div className={styles.inputContainer}>
              <input
                placeholder="Title"
                onChange={(e) => setTitle(e.currentTarget.value)}
              ></input>
            </div>
            <textarea
              placeholder="Note content"
              onChange={(e) => setContent(e.currentTarget.value)}
            ></textarea>
            <div className={styles.bottom}>
              <p className={styles.error}>{error ? error : ""}</p>
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
    </LocalizationProvider>
  );
};
