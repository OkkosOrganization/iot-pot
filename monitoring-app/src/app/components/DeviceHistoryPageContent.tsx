"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DeviceHistoryContent } from "./DeviceHistoryContent";

export const DeviceHistoryPageContent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DeviceHistoryContent />
    </LocalizationProvider>
  );
};
