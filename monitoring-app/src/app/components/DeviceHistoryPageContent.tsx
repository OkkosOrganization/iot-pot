"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DeviceHistoryContent } from "./DeviceHistoryContent";
import { Device } from "@/types";

export const DeviceHistoryPageContent = ({ device }: { device: Device }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DeviceHistoryContent device={device} />
    </LocalizationProvider>
  );
};
