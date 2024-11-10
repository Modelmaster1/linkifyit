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
      <UploadButton
      className="text-gray-800 font-bold"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      </div>
    </div>
  );
};
