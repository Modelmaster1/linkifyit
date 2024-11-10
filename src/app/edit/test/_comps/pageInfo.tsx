"use client";
import { UploadDropzone } from "@uploadthing/react";
import { useState } from "react";
import { OurFileRouter } from "~/app/api/uploadthing/core";
import { InfoModel, pages, UserInfo } from "~/app/models";
import { UploadButton } from "~/utils/uploadthing";

export default function PageInfoView({
  currentInfo,
  setCurrentInfo,
  userInfo,
}: {
  userInfo: UserInfo;
  currentInfo: InfoModel;
  setCurrentInfo: React.Dispatch<React.SetStateAction<InfoModel | null>>;
}) {
  function formatInput(input: string): string | null {
    const result = input.length > 0 ? input : null;

    return result;
  }

  return (
    <div className="flex h-full w-[700px] max-w-full flex-col gap-6 rounded-3xl border border-[#9193b3]/20 bg-[#181726] p-4">
      <div className="flex flex-col gap-1">
        <div className="text-lg">Page Info</div>
        <div className="text-sm opacity-70">
          Edit the details of your page. You'll figure it out!
        </div>
      </div>

      <div className="flex gap-2">
        <img
          src={currentInfo.imageURL ?? userInfo.imageUrl ?? undefined}
          className="aspect-square bg-[#9193b3]/20 object-cover outline outline-2 outline-[#9193b3]/50 md:h-[150px]"
          style={{ borderRadius: "2rem", width: "100px", height: "100px" }}
        />
        <div className="flex flex-col gap-2">

          <UploadDropzone<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              setCurrentInfo({
                ...currentInfo,
                imageURL: res[0]?.url ?? null,
              });
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            onUploadBegin={(name) => {
              // Do something once upload begins
              console.log("Uploading: ", name);
            }}
            onDrop={(acceptedFiles) => {
              // Do something with the accepted files
              console.log("Accepted files: ", acceptedFiles);
            }}
          />

          <button
            className="rounded-2xl bg-[#9193b3]/20 p-2"
            style={{
              opacity: currentInfo.imageURL ? "1" : "0.5",
              cursor: currentInfo.imageURL ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              setCurrentInfo({
                ...currentInfo,
                imageURL: null,
              });
            }}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-base font-medium">Slug</div>

        <div className="text-xs">
          <input
            value={currentInfo.slug ?? ""}
            onChange={(e) =>
              setCurrentInfo({
                ...currentInfo,
                slug: e.target.value,
              })
            }
            className="w-full rounded-xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-base font-medium">Name</div>

        <div className="flex gap-4 text-xs">
          <input
            placeholder={userInfo.fullName ?? userInfo.fullName ?? "Anonymous"}
            value={currentInfo.overrideName ?? ""}
            onChange={(e) => {
              setCurrentInfo({
                ...currentInfo,
                overrideName: formatInput(e.target.value),
              });
            }}
            className="w-full rounded-xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
          />
        </div>
        <div className="text-xs opacity-50">
          By default, the name will be the same as the one in your account.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-base font-medium">Description</div>

        <div className="text-xs">
          <textarea
            value={currentInfo.description ?? ""}
            onChange={(e) =>
              setCurrentInfo({
                ...currentInfo,
                description: formatInput(e.target.value),
              })
            }
            className="min-h-[200px] w-full rounded-xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
          />
        </div>
      </div>
    </div>
  );
}
