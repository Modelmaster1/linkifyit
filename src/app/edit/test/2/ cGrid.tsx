"use client";
import {
  Link,
  LinkIcon,
  LucideProps,
  Pen,
  Plus,
  RectangleHorizontal,
  Scan,
  Square,
  X,
} from "lucide-react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import React, {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Layout } from "react-grid-layout";
import getDominantColors, { ImgeColorOptions } from "~/server/getColors";
import "~/styles/gg.css";
import "~/styles/globals.css";
import { CustomiseOptionsModel, links } from "~/app/models";
import "~/styles/globals.css";

export default function MyFirstGrid({
  editMode,
  links,
  windowSize,
  currentCustomisationOptions,
  layout,
  handleResize,
  saveLayout,
  unselectLink,
}: {
  currentCustomisationOptions: CustomiseOptionsModel;
  links: links[];
  editMode: boolean;
  unselectLink?: (id: number | null) => void;
  windowSize: { width: number; height: number };
  layout: LayoutStuff;
  handleResize: (id: string, size: "small" | "medium" | "large") => void;
  saveLayout: (newLayout: Layout[]) => void;
}) {
  return (
    <div
      className="overflow-x-hidden text-[#c4c5ea]"
      //style={{ width: "100vw", height: "100vh" }}
    >
      <ResponsiveGridLayout
        className="layout"
        cols={cols}
        layouts={layout}
        breakpoints={breakpoints}
        width={windowSize.width - 200 > 900 ? 900 : windowSize.width - 200}
        containerPadding={containerPaddings}
        compactType="vertical"
        verticalCompact={true}
        onLayoutChange={saveLayout}
      >
        {layout.xl &&
          layout.xl.map((item, index) => (
            <div key={item.i}>
              <LinkView
                editMode={editMode}
                currentCustomisationOptions={currentCustomisationOptions}
                handleResize={handleResize}
                layoutProps={item}
                unselectLink={unselectLink}
                item={links.find((link) => String(link.id) === item.i)}
              />
            </div>
          ))}
      </ResponsiveGridLayout>
    </div>
  );
}

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  breakpoints,
  cols,
  containerPaddings,
  LayoutStuff,
} from "./gridOptions";

export function LinkView({
  editMode,
  item,
  currentCustomisationOptions,
  layoutProps,
  handleResize,
  unselectLink,
  selectLink,
}: {
  item: links | undefined;
  editMode: boolean;
  unselectLink?: (id: number | null) => void; // if not provided the size menu and remove button is hidden
  selectLink?: (id: number | null) => void; // if not provided the add button is hidden
  currentCustomisationOptions: CustomiseOptionsModel;
  layoutProps: Layout;
  handleResize: (id: string, size: "small" | "medium" | "large") => void;
}) {
  const [colors, setColors] = useState<string[]>([]);
  const [overlayColor, setOverlayColor] = useState<string>(
    "rgb(24 23 37 / 0.8)",
  );
  const imageURL = item?.iconURL;
  const [label, setLabel] = useState(item?.name);

  useEffect(() => {
    if (!item) return;
    setLabel(item?.name);
  }, [item]);

  useEffect(() => {
    // Fetch the dominant colors when the component is mounted
    console.log("starting");
    if (!imageURL || !currentCustomisationOptions.useAutoLinkTinting) return;

    const options: ImgeColorOptions = {
      url: imageURL ?? "",
      excludeBlackAndWhite: true,
      numOfColors: 5,
      notToDark: true,
      notToBright: false,
    };
    getDominantColors(options).then(setColors).catch(console.error);
  }, [imageURL]);

  function tapAction() {
    if (!item) return;
    if (editMode) return

    window.open(item?.url, "_blank", "noopener,noreferrer");
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={!editMode}
        onClick={tapAction}
      >
        <div
          className={`h-full select-none text-white ${editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
          style={{
            borderRadius: "2rem",
            background: `${colors.length <= 0 || !currentCustomisationOptions.useAutoLinkTinting ? currentCustomisationOptions.defaultBackgroundColorForLinks : `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`}`,
          }}
        >
          <div
            className={`flex h-full flex-col justify-between p-3`}
            style={{
              borderRadius: "2rem",
              backgroundColor:
                colors.length <= 0 ||
                !currentCustomisationOptions.useAutoLinkTinting
                  ? undefined
                  : `rgb(24 23 37 / 0.7)`,
            }}
          >
            {item && (
              <>
                {imageURL ? (
                  <img
                    className="h-14 w-14 overflow-hidden object-cover"
                    style={{ borderRadius: "1.4rem" }}
                    src={imageURL}
                  />
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center overflow-hidden bg-[#9193b3]/20 object-cover outline outline-[#9193b3]/50"
                    style={{ borderRadius: "1.4rem" }}
                  >
                    <LinkIcon className="opacity-80" />
                  </div>
                )}
              </>
            )}

            <div className="pb-2 ps-1">{item?.name}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent
        className="rounded-3xl text-[#c4c5ea] drop-shadow-lg"
        style={{ backgroundColor: "#181725" }}
      >
        <input
          value={label ?? undefined}
          placeholder="Name"
          onChange={(e) => setLabel(e.target.value)}
          className="m-5 w-[250px] rounded-3xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
        />
        <div
          className="-mt-1 w-full bg-[#9193b3]/20"
          style={{ height: "2px" }}
        />
        <div className="mx-5 mt-2 text-sm opacity-50">
          change the name for all pages
        </div>

        {unselectLink && (
          <div
            className="mx-5 mt-2 flex h-20 items-center justify-evenly bg-[#110e21] p-2"
            style={{ borderRadius: "2rem" }}
          >
            <div
              className={`flex h-full w-full flex-col items-center justify-center rounded-3xl ${layoutProps.w == 1 && "bg-[#d97fb0]/80"}`}
              onClick={() => handleResize(layoutProps.i, "small")}
            >
              <Square />
              <div className="text-xs">small</div>
            </div>
            <div
              className={`flex h-full w-full flex-col items-center justify-center rounded-3xl ${layoutProps.w == 2 && layoutProps.h == 1 && "bg-[#d97fb0]/80"}`}
              onClick={() => handleResize(layoutProps.i, "medium")}
            >
              <RectangleHorizontal />
              <div className="text-xs">medium</div>
            </div>
            <div
              className={`flex h-full w-full flex-col items-center justify-center rounded-3xl ${layoutProps.w == 2 && layoutProps.h == 2 && "bg-[#d97fb0]/80"}`}
              onClick={() => handleResize(layoutProps.i, "large")}
            >
              <Scan />
              <div className="text-xs">large</div>
            </div>
          </div>
        )}
        <div className="mx-5 mt-4 text-base opacity-50">Actions</div>
        <div className="mx-5 mb-5 mt-2 flex flex-col gap-1 text-sm">
          <button>
            <LinkContextAction name="Edit Link" Icon={Pen} />
          </button>
          {unselectLink ? (
            <button
              onClick={() =>
                unselectLink ? unselectLink(item?.id ?? null) : null
              }
            >
              <LinkContextAction name="Remove Link from Page" Icon={X} />
            </button>
          ) : (
            <button
              onClick={() => (selectLink ? selectLink(item?.id ?? null) : null)}
            >
              <LinkContextAction name="Add Link from Page" Icon={Plus} />
            </button>
          )}
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}

interface LinkContextActionProps {
  name: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

function LinkContextAction({ name, Icon }: LinkContextActionProps) {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-full opacity-50 hover:bg-[#110e21]/80 hover:text-white hover:opacity-100">
      <div className="flex items-center gap-2 p-2">
        <Icon className="size-4" />
        <div>{name}</div>
      </div>
    </div>
  );
}

export function LinkViewMedium() {
  const [colors, setColors] = useState<string[]>([]);
  const imageURL =
    "https://static.cdninstagram.com/rsrc.php/v3/yR/r/hexDR1NOpRC.png";

  useEffect(() => {
    // Fetch the dominant colors when the component is mounted
    console.log("starting");
    if (!imageURL) return;

    const options: ImgeColorOptions = {
      url: imageURL,
      excludeBlackAndWhite: true,
      numOfColors: 5,
      notToDark: true,
      notToBright: false,
    };
    getDominantColors(options).then(setColors).catch(console.error);
  }, []);

  return (
    <>
      <div
        className="w-[300px] bg-red-500"
        style={{
          borderRadius: "2rem",
          background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        }}
      >
        <div
          className="flex flex-row justify-between gap-8 bg-gray-900/70 p-3"
          style={{
            borderRadius: "2rem",
            aspectRatio: 2 / 1,
          }}
        >
          <div className="flex h-full flex-col justify-between">
            <img
              className="h-14 w-14 overflow-hidden object-cover"
              style={{ borderRadius: "1.4rem" }}
              src={imageURL}
            />
            <div className="pb-2 ps-1">Instagram</div>
          </div>
          <div className="flex h-full flex-col justify-center">
            <div className="text-sm">
              hello this right here is an account that you should definetly
              follow right away
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
