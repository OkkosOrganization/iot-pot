"use client";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MonthCalendar } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekOfYear from "dayjs/plugin/weekOfYear";
import styles from "./DeviceHistoryContent.module.css";
import { LineChart } from "@mui/x-charts";
import useSWR from "swr";
import {
  Device,
  MeasurementsApiResponse,
  Note,
  NotesApiResponse,
  WateringsApiResponse,
  SensorLabels,
  Watering,
} from "@/types";
import { NoteItem } from "./NoteItem";
import updateLocale from "dayjs/plugin/updateLocale";
import { WateringItem } from "./WateringItem";

dayjs.extend(utc);
dayjs.extend(timezone);
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

const wateringsFetcher = async (
  url: string,
  options?: RequestInit
): Promise<WateringsApiResponse> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<WateringsApiResponse>;
};

type DeviceHistoryContentProps = { device: Device };
export const DeviceHistoryContent = ({ device }: DeviceHistoryContentProps) => {
  const initialDate = dayjs(Date.now()).tz("Europe/Helsinki");
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

  // WATERINGS FETCHERS
  const { data: wateringsDayData, error: wateringsDayError } =
    useSWR<WateringsApiResponse>(
      mode === "day" && date !== null
        ? `/api/wateringsByDay/?deviceId=${device.deviceId}&date=${dayjs(
            date
          ).format("YYYY-MM-DD")}`
        : null,
      wateringsFetcher
    );
  const { data: wateringsMonthData, error: wateringsMonthError } =
    useSWR<WateringsApiResponse>(
      mode === "month" && year !== null && month !== null
        ? `/api/wateringsByMonth/?deviceId=${device.deviceId}&month=${month}&year=${year}`
        : null,
      wateringsFetcher
    );
  const { data: wateringsWeekData, error: wateringsWeekError } =
    useSWR<WateringsApiResponse>(
      mode === "week" && year !== null && weekNumber !== null
        ? `/api/wateringsByWeek/?deviceId=${device.deviceId}&weekNumber=${weekNumber}&year=${year}`
        : null,
      wateringsFetcher
    );

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
          data.luminosity.push(row.data.luminosity);
          data.waterLevel.push(row.data.waterLevel);
          data.waterOverflow.push(row.data.waterOverflow);
          const d = dayjs
            .utc(row.timestamp)
            .tz("Europe/Helsinki")
            .format("HH:mm");
          data.dates.push(d);
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
          data.luminosity.push(row.data.luminosity);
          data.waterLevel.push(row.data.waterLevel);
          data.waterOverflow.push(row.data.waterOverflow);
          const d = dayjs
            .utc(row.timestamp)
            .tz("Europe/Helsinki")
            .format("D.M. HH:mm");
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
          data.luminosity.push(row.data.luminosity);
          data.waterLevel.push(row.data.waterLevel);
          data.waterOverflow.push(row.data.waterOverflow);
          const d = dayjs
            .utc(row.timestamp)
            .tz("Europe/Helsinki")
            .format("D.M. HH:mm");
          data.dates.push(d);
        }
      }
      break;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.visualizationContainer}>
          <div className={styles.errorContainer}>
            {weekError ||
            monthError ||
            dayError ||
            notesDayError ||
            notesWeekError ||
            notesMonthError ||
            wateringsDayError ||
            wateringsMonthError ||
            wateringsWeekError ? (
              <div>
                {weekError && weekError}
                {monthError && monthError}
                {dayError && dayError}
                {notesDayError && notesDayError}
                {notesWeekError && notesWeekError}
                {notesMonthError && notesMonthError}
                {wateringsDayError && wateringsDayError}
                {wateringsMonthError && wateringsMonthError}
                {wateringsWeekError && wateringsWeekError}
              </div>
            ) : null}
          </div>

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

          <div className={styles.chartContainer}>
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
            ) : (
              "No data to display"
            )}
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

      <div className={styles.notesAndWateringsContainer}>
        <div className={styles.notesWrapper}>
          <h2 className={styles.notesTitle}>Notes</h2>
          <NotesList
            mode={mode}
            notesDayData={notesDayData}
            notesWeekData={notesWeekData}
            notesMonthData={notesMonthData}
          />
        </div>

        <div className={styles.wateringsWrapper}>
          <h2 className={styles.wateringsTitle}>Watering log</h2>
          <div className={styles.wateringsContainer}>
            <WateringsTable
              mode={mode}
              wateringsDayData={wateringsDayData}
              wateringsWeekData={wateringsWeekData}
              wateringsMonthData={wateringsMonthData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type WateringsTableProps = {
  mode: string;
  wateringsDayData: WateringsApiResponse | undefined;
  wateringsWeekData: WateringsApiResponse | undefined;
  wateringsMonthData: WateringsApiResponse | undefined;
};
const WateringsTable = ({
  mode,
  wateringsDayData,
  wateringsWeekData,
  wateringsMonthData,
}: WateringsTableProps) => {
  return (
    <table className={styles.waterings}>
      {mode === "day" ? (
        wateringsDayData?.data?.length ? (
          <>
            <WateringHeaderRow />
            {wateringsDayData?.data?.map((n: Watering) => (
              <WateringItem data={n} key={n.id} />
            ))}
          </>
        ) : (
          <NoWateringResults />
        )
      ) : null}

      {mode === "week" ? (
        wateringsWeekData?.data?.length ? (
          <>
            <WateringHeaderRow />
            {wateringsWeekData?.data?.map((n: Watering) => (
              <WateringItem data={n} key={n.id} />
            ))}
          </>
        ) : (
          <NoWateringResults />
        )
      ) : null}

      {mode === "month" ? (
        wateringsMonthData?.data?.length ? (
          <>
            <WateringHeaderRow />
            {wateringsMonthData?.data?.map((n: Watering) => (
              <WateringItem data={n} key={n.id} />
            ))}
          </>
        ) : (
          <NoWateringResults />
        )
      ) : null}
    </table>
  );
};

type NotesListProps = {
  mode: string;
  notesDayData: NotesApiResponse | undefined;
  notesWeekData: NotesApiResponse | undefined;
  notesMonthData: NotesApiResponse | undefined;
};
const NotesList = ({
  mode,
  notesDayData,
  notesMonthData,
  notesWeekData,
}: NotesListProps) => {
  return (
    <div className={styles.notesContainer}>
      <div className={styles.notes}>
        {mode === "day" ? (
          notesDayData?.data?.length ? (
            notesDayData?.data?.map((n: Note) => (
              <NoteItem note={n} key={n.id} />
            ))
          ) : (
            <NoNotesResults />
          )
        ) : null}

        {mode === "week" ? (
          notesWeekData?.data?.length ? (
            notesWeekData?.data?.map((n: Note) => (
              <NoteItem note={n} key={n.id} />
            ))
          ) : (
            <NoNotesResults />
          )
        ) : null}

        {mode === "month" ? (
          notesMonthData?.data?.length ? (
            notesMonthData?.data?.map((n: Note) => (
              <NoteItem note={n} key={n.id} />
            ))
          ) : (
            <NoNotesResults />
          )
        ) : null}
      </div>
    </div>
  );
};

const WateringHeaderRow = () => {
  return (
    <tr className={styles.headerRow}>
      <th>Watering amount</th>
      <th>Date & time</th>
    </tr>
  );
};

const NoWateringResults = () => {
  return (
    <tr>
      <td align="center">No waterings</td>
    </tr>
  );
};

const NoNotesResults = () => {
  return (
    <div>
      <center>No notes</center>
    </div>
  );
};
