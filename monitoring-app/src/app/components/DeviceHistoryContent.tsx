"use client";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MonthCalendar } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import styles from "./DeviceHistoryContent.module.css";
import { LineChart } from "@mui/x-charts";
dayjs.extend(weekOfYear);

const pData = [21, 21, 22, 25, 21, 27, 23];
const xLabels = ["00", "01", "02", "03", "04", "05", "06"];

export const DeviceHistoryContent = () => {
  const [mode, setMode] = useState<"day" | "week" | "month">("day");
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className={styles.container}>
      <div className={styles.visualizationContainer}>
        <div className={styles.panel}>
          {mode === "day" ? <div>Graph for {date?.toDateString()}</div> : null}

          {mode === "week" ? (
            <div>
              Graph for week {dayjs(date).week()}, {dayjs(date).year()}
            </div>
          ) : null}

          {mode === "month" ? (
            <div>
              Graph for month {dayjs(date).month()}, {dayjs(date).year()}
            </div>
          ) : null}

          <LineChart
            height={368}
            series={[
              {
                curve: "linear",
                data: pData,
                label: "Air temperature",
                color: "#6a5acd",
              },
            ]}
            xAxis={[{ scaleType: "point", data: xLabels }]}
            sx={{
              "& .MuiLineElement-root": {
                strokeWidth: 4,
              },
              "& .MuiMarkElement-root": {
                strokeWidth: 4,
                scale: 1.25,
              },
              "& .MuiChartsAxis-line": {
                strokeWidth: 2,
                stroke: "#727272",
              },
            }}
          />
        </div>
      </div>
      <div className={styles.toolsContainer}>
        <div className={`${styles.panel} ${styles.toolsPanel}`}>
          <div className={styles.modeSelectorContainer}>
            <ul className={styles.modeSelector}>
              <li
                className={`${styles.link} ${
                  mode === "day" ? styles.active : ""
                }`}
                onClick={() => setMode("day")}
              >
                DAY
              </li>
              <li
                className={`${styles.link} ${
                  mode === "week" ? styles.active : ""
                }`}
                onClick={() => setMode("week")}
              >
                WEEK
              </li>
              <li
                className={`${styles.link} ${
                  mode === "month" ? styles.active : ""
                }`}
                onClick={() => setMode("month")}
              >
                MONTH
              </li>
            </ul>
          </div>
          <div className={styles.datePickerContainer}>
            {mode === "day" ? (
              <DateCalendar
                views={["day", "month"]}
                maxDate={dayjs(Date.now())}
                onChange={(value) => {
                  const date = dayjs(value).toDate();
                  console.log(date);
                  setDate(date);
                }}
              />
            ) : null}
            {mode === "week" ? (
              <DateCalendar
                views={["day", "month"]}
                maxDate={dayjs(Date.now())}
                displayWeekNumber
                onChange={(value) => {
                  const week = dayjs(value).week();
                  const date = dayjs(value).toDate();
                  console.log(week);
                  setDate(date);
                }}
              />
            ) : null}
            {mode === "month" ? (
              <MonthCalendar
                maxDate={dayjs(Date.now())}
                onChange={(value) => {
                  const date = dayjs(value).toDate();
                  console.log(date);
                  setDate(date);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
