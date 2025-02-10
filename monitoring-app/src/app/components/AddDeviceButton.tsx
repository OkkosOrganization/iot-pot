"use client";
export const AddDeviceBtn = () => {
  return (
    <button
      className={"btn"}
      onClick={() => document.getElementById("addDeviceBtn")?.click()}
    >
      ADD DEVICE
    </button>
  );
};
