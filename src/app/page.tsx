"use client";

import { UploadButton } from "~/utils/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CustomUploadButton/>
    </main>
  );
}


import "@uploadthing/react/styles.css";

// Component Definition
const CustomUploadButton = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
      <div className="absolute right-10 bottom-10 z-10 bg-[#181724] outline outline-[#110e21] p-4 rounded-3xl text-xs">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-1">
            <div className="text-base opacity-90">
              Looks Awesome!
            </div>

            <div className="opacity-50">You have unsaved changes</div>
          </div>
          <button
            className="rounded-full bg-[#d97fb0] p-3 text-white hover:bg-[#9193b3]"
            onClick={(e) => {
              e.preventDefault();
              //update();
            }}
          >
            Save changes
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
