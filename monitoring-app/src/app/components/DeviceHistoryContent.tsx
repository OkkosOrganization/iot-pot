"use client";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MonthCalendar } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import styles from "./DeviceHistoryContent.module.css";
import { LineChart } from "@mui/x-charts";
import useSWR from "swr";
import {
  Device,
  MeasurementsApiResponse,
  Note,
  NotesApiResponse,
  SensorLabels,
} from "@/types";
import { NoteItem } from "./NoteItem";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const SENSOR_LABELS_MAP: Record<SensorLabels, string> = {
  airTemperature: "Air Temperature",
  airHumidity: "Air Humidity",
  soilMoisture: "Soil Moisture",
  soilPh: "Soil Ph",
  soilTemperature: "Soil Temperature",
  luminosity: "Luminosity",
  waterLevel: "Water Level",
  waterOverflow: "Water Overflow",
};

const fetcher = async (
  url: string,
  options?: RequestInit
): Promise<MeasurementsApiResponse> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<MeasurementsApiResponse>;
};

const notesFetcher = async (
  url: string,
  options?: RequestInit
): Promise<NotesApiResponse> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<NotesApiResponse>;
};

type DeviceHistoryContentProps = { device: Device };
export const DeviceHistoryContent = ({ device }: DeviceHistoryContentProps) => {
  const initialDate = dayjs(Date.now());
  const [mode, setMode] = useState<"day" | "week" | "month">("day");
  const [chosenSensorLabel, setChosenSensorLabel] =
    useState<SensorLabels>("airTemperature");
  const [date, setDate] = useState<Dayjs>(initialDate);
  const [weekNumber, setWeekNumber] = useState<number>(initialDate.week());
  const [year, setYear] = useState<number | null>(initialDate.year());
  const [month, setMonth] = useState<number | null>(initialDate.month());

  // MEASUREMENTS FETCHERS
  const { data: weekData, error: weekError } = useSWR<MeasurementsApiResponse>(
    mode === "week" && year !== null && weekNumber !== null
      ? `/api/measurementsByWeek/?deviceId=${device.deviceId}&weekNumber=${weekNumber}&year=${year}`
      : null,
    fetcher
  );
  const { data: monthData, error: monthError } =
    useSWR<MeasurementsApiResponse>(
      mode === "month" && year !== null && month !== null
        ? `/api/measurementsByMonth/?deviceId=${device.deviceId}&month=${month}&year=${year}`
        : null,
      fetcher
    );
  const { data: dayData, error: dayError } = useSWR<MeasurementsApiResponse>(
    mode === "day" && date !== null
      ? `/api/measurementsByDay/?deviceId=${device.deviceId}&date=${dayjs(
          date
        ).format("YYYY-MM-DD")}`
      : null,
    fetcher
  );

  // NOTES FETCHERS
  const { data: notesDayData, error: notesDayError } = useSWR<NotesApiResponse>(
    mode === "day" && date !== null
      ? `/api/notesByDay/?deviceId=${device.deviceId}&date=${dayjs(date).format(
          "YYYY-MM-DD"
        )}`
      : null,
    notesFetcher
  );
  const { data: notesMonthData, error: notesMonthError } =
    useSWR<NotesApiResponse>(
      mode === "month" && year !== null && month !== null
        ? `/api/notesByMonth/?deviceId=${device.deviceId}&month=${month}&year=${year}`
        : null,
      notesFetcher
    );
  const { data: notesWeekData, error: notesWeekError } =
    useSWR<NotesApiResponse>(
      mode === "week" && year !== null && weekNumber !== null
        ? `/api/notesByWeek/?deviceId=${device.deviceId}&weekNumber=${weekNumber}&year=${year}`
        : null,
      notesFetcher
    );

  type dataType = {
    airTemperature: number[];
    airHumidity: number[];
    soilMoisture: number[];
    soilPh: number[];
    soilTemperature: number[];
    luminosity: number[];
    waterLevel: number[];
    waterOverflow: number[];
    dates: string[];
  };

  const data: dataType = {
    airTemperature: [],
    airHumidity: [],
    soilMoisture: [],
    soilPh: [],
    soilTemperature: [],
    luminosity: [],
    waterLevel: [],
    waterOverflow: [],
    dates: [],
  };
  switch (mode) {
    case "day":
      if (dayData && dayData.data.length) {
        for (const row of dayData.data) {
          data.airTemperature.push(row.data.airTemperature);
          data.airHumidity.push(row.data.airHumidity);
          data.soilMoisture.push(row.data.soilMoisture);
          data.soilPh.push(row.data.soilPh);
          data.soilTemperature.push(row.data.soilTemperature);
          const d = new Date(row.timestamp).toLocaleTimeString();
          const split = d.split(":");
          const hoursMinutes = split[0] + ":" + split[1];
          data.dates.push(hoursMinutes);
        }
      }
      break;
    case "month":
      if (monthData && monthData.data.length) {
        for (const row of monthData.data) {
          data.airTemperature.push(row.data.airTemperature);
          data.airHumidity.push(row.data.airHumidity);
          data.soilMoisture.push(row.data.soilMoisture);
          data.soilPh.push(row.data.soilPh);
          data.soilTemperature.push(row.data.soilTemperature);
          const d = new Date(row.timestamp).toLocaleString();
          data.dates.push(d);
        }
      }
      break;
    case "week":
      if (weekData && weekData.data.length) {
        for (const row of weekData.data) {
          data.airTemperature.push(row.data.airTemperature);
          data.airHumidity.push(row.data.airHumidity);
          data.soilMoisture.push(row.data.soilMoisture);
          data.soilPh.push(row.data.soilPh);
          data.soilTemperature.push(row.data.soilTemperature);
          const d = new Date(row.timestamp).toLocaleDateString();
          data.dates.push(d);
        }
      }
      break;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.visualizationContainer}>
          <div>
            {weekError ||
            monthError ||
            dayError ||
            notesDayError ||
            notesWeekError ||
            notesMonthError ? (
              <div>
                {weekError && weekError}
                {monthError && monthError}
                {dayError && dayError}
                {notesDayError && notesDayError}
                {notesWeekError && notesWeekError}
                {notesMonthError && notesMonthError}
              </div>
            ) : null}

            <div className={styles.valueSelectorContainer}>
              <div className={styles.valueSelector}>
                {Object.entries(SENSOR_LABELS_MAP).map(([key, label]) => {
                  return (
                    <button
                      className={
                        key === chosenSensorLabel ? styles.activeBtn : ""
                      }
                      key={key}
                      onClick={() => setChosenSensorLabel(key as SensorLabels)}
                    >
                      {label.toLocaleUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {data.dates.length && chosenSensorLabel ? (
              <LineChart
                height={366}
                series={[
                  {
                    curve: "linear",
                    data: data[chosenSensorLabel],

                    color: "#6a5acd",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: data.dates,
                    tickLabelStyle: {
                      angle: 45,
                      textAnchor: "start",
                      fontSize: 10,
                    },
                    disableLine: true,
                    disableTicks: true,
                  },
                ]}
                yAxis={[
                  {
                    disableLine: true,
                    disableTicks: true,
                  },
                ]}
                axisHighlight={{ x: "none" }}
                margin={{ top: 30, right: 30, bottom: 50, left: 30 }}
                sx={{
                  "& .MuiLineElement-root": {
                    strokeWidth: 4,
                  },
                  "& .MuiMarkElement-root": {
                    strokeWidth: 4,
                    scale: 1.25,
                  },
                }}
              />
            ) : null}
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
                  value={dayjs(date)}
                  onChange={(value) => {
                    const date = dayjs(value);
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
                    const year = dayjs(value).year();
                    setWeekNumber(week);
                    setYear(year);
                  }}
                />
              ) : null}
              {mode === "month" ? (
                <MonthCalendar
                  maxDate={dayjs(Date.now())}
                  onChange={(value) => {
                    const month = dayjs(value).month();
                    const year = dayjs(value).year();
                    setMonth(month);
                    setYear(year);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <h2 className={styles.notesTitle}>Notes</h2>
      <div className={styles.notesContainer}>
        <div className={styles.notes}>
          {mode === "day"
            ? notesDayData?.data?.length
              ? notesDayData?.data?.map((n: Note) => (
                  <NoteItem note={n} key={n.id} />
                ))
              : "No notes"
            : null}

          {mode === "week"
            ? notesWeekData?.data?.length
              ? notesWeekData?.data?.map((n: Note) => (
                  <NoteItem note={n} key={n.id} />
                ))
              : "No notes"
            : null}

          {mode === "month"
            ? notesMonthData?.data?.length
              ? notesMonthData?.data?.map((n: Note) => (
                  <NoteItem note={n} key={n.id} />
                ))
              : "No notes"
            : null}
        </div>
      </div>
    </div>
  );
};
