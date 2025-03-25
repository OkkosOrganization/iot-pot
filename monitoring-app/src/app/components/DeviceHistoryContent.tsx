"use client";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MonthCalendar } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import styles from "./DeviceHistoryContent.module.css";
import { LineChart } from "@mui/x-charts";
import useSWR from "swr";
import { Device } from "@/types";
dayjs.extend(utc);
dayjs.extend(weekOfYear);

//const fetcher = (...args) => fetch(...args).then((res) => res.json());
const fetcher = async (
  url: string,
  options?: RequestInit
): Promise<ApiResponse> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<ApiResponse>;
};

type ApiResponse = {
  status: 0 | 1;
  data: {
    id: number;
    deviceId: string;
    timestamp: string;
    data: {
      airTemperature: number;
      airHumidity: number;
      soilMoisture: number;
    };
    error?: string;
  }[];
};

type SensorLabels = "airTemperature" | "airHumidity" | "soilMoisture";
const SENSOR_LABELS_MAP: Record<SensorLabels, string> = {
  airTemperature: "Air Temperature",
  airHumidity: "Air Humidity",
  soilMoisture: "Soil Moisture",
};

export const DeviceHistoryContent = ({ device }: { device: Device }) => {
  const [mode, setMode] = useState<"day" | "week" | "month">("day");
  const [chosenSensorLabel, setChosenSensorLabel] =
    useState<SensorLabels>("airTemperature");
  const [date, setDate] = useState<string | null>(null);
  const [weekNumber, setWeekNumber] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const { data: weekData, error: weekError } = useSWR<ApiResponse>(
    mode === "week" && year !== null && weekNumber !== null
      ? `/api/measurementsByWeek/?deviceId=${device.deviceId}&weekNumber=${weekNumber}&year=${year}`
      : null,
    fetcher
  );

  const { data: monthData, error: monthError } = useSWR<ApiResponse>(
    mode === "month" && year !== null && month !== null
      ? `/api/measurementsByMonth/?deviceId=${device.deviceId}&month=${month}&year=${year}`
      : null,
    fetcher
  );

  const { data: dayData, error: dayError } = useSWR<ApiResponse>(
    mode === "day" && date !== null
      ? `/api/measurementsByDay/?deviceId=${device.deviceId}&date=${date}`
      : null,
    fetcher
  );

  type dataType = {
    airTemperature: number[];
    airHumidity: number[];
    soilMoisture: number[];
    dates: string[];
  };

  const data: dataType = {
    airTemperature: [],
    airHumidity: [],
    soilMoisture: [],
    dates: [],
  };
  switch (mode) {
    case "day":
      if (dayData && dayData.data.length) {
        for (const row of dayData.data) {
          data.airTemperature.push(row.data.airTemperature);
          data.airHumidity.push(row.data.airHumidity);
          data.soilMoisture.push(row.data.soilMoisture);
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
          const d = new Date(row.timestamp).toLocaleTimeString();
          const split = d.split(":");
          const hoursMinutes = split[0] + ":" + split[1];
          data.dates.push(hoursMinutes);
        }
      }
      break;
    case "week":
      if (weekData && weekData.data.length) {
        for (const row of weekData.data) {
          data.airTemperature.push(row.data.airTemperature);
          data.airHumidity.push(row.data.airHumidity);
          data.soilMoisture.push(row.data.soilMoisture);
          const d = new Date(row.timestamp).toLocaleTimeString();
          const split = d.split(":");
          const hoursMinutes = split[0] + ":" + split[1];
          data.dates.push(hoursMinutes);
        }
      }
      break;
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.visualizationContainer}>
          <div className={styles.panel}>
            {weekError || monthError || dayError ? (
              <div>
                {weekError && weekError}
                {monthError && monthError}
                {dayError && dayError}
              </div>
            ) : null}

            <div>
              {Object.entries(SENSOR_LABELS_MAP).map(([key, label]) => {
                return (
                  <button
                    key={key}
                    onClick={() => setChosenSensorLabel(key as SensorLabels)}
                  >
                    {label.toLocaleUpperCase()}
                  </button>
                );
              })}
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
                      fontSize: 12,
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
                  onChange={(value) => {
                    const date = dayjs(value).utc().toDate();
                    const dateString = dayjs(date).format("YYYY-MM-DD");
                    setDate(dateString);
                    setWeekNumber(null);
                    setYear(null);
                    setMonth(null);
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
                    setMonth(null);
                    setDate(null);
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
                    setDate(null);
                    setWeekNumber(null);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div>className={styles.container}</div>
    </>
  );
};
