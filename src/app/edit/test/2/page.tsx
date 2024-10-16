"use client";
import { Link, RectangleHorizontal, Scan, Square, X } from "lucide-react";
import {
  Responsive as ResponsiveGridLayout,
  WidthProvider,
  Responsive,
} from "react-grid-layout";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Layout } from "react-grid-layout";
import getDominantColors, { ImgeColorOptions } from "~/server/getColors";
import "~/styles/gg.css";
import "~/styles/globals.css";
import { links } from "~/app/models";
import { getLinks } from "~/server/getUserItems";
import "~/styles/globals.css";

interface BreakpointsStuff {
  [P: string]: number;
}

interface LayoutStuff {
  [P: string]: Layout[];
}

export default function MyFirstGrid() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [links, setLinks] = useState<links[]>([]);

  const userID = "user_2hvSqhFlCy1N3hOD80KRXNGR82h"; //workaround because no wifi - useClerk()?.user?.id;

  async function fetchLinks() {
    if (!userID) {
      console.log("no id");
      return;
    }
    const result = await getLinks(userID);
    setLinks(result);
  }

  useEffect(() => {
    fetchLinks();
  }, [userID]);

  const breakpoints: BreakpointsStuff = {
    xl: 1400,
    lg: 1000,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 240,
  };
  const cols: BreakpointsStuff = { xl: 8, lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 };

  function adjustSize(id: string, newW: number = 1, newH: number = 1) {
    if (!currentLayout.xl) return
    const oldItem = currentLayout.xl?.find((item) => item.i == id)
    if (!oldItem) return

    const newItem = {...oldItem, w: newW, h: newH}

    var newLayout = currentLayout
    if (!newLayout.xl) return
    newLayout.xl?.filter((item) => item.i = id)

    newLayout = {...newLayout, xl: [...newLayout.xl, newItem]}

    setCurrentLayout(newLayout)
  }

  const defaultLayouts: LayoutStuff = {
    xl: [
      { i: "0", x: 0, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "1", x: 1, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "2", x: 2, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "3", x: 3, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "4", x: 4, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "5", x: 5, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "6", x: 6, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "7", x: 7, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "8", x: 0, y: 1, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "9", x: 1, y: 1, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "10", x: 2, y: 1, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "11", x: 3, y: 1, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 },
      { i: "111", x: 4, y: 1, w: 2, h: 1, isResizable: true, maxW: 2, maxH: 2 },
    ],
  };

  const [currentLayout, setCurrentLayout] = useState<LayoutStuff>(defaultLayouts);
  const [currentRowHeight, setCurrentRowHeight] = useState(175);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setCurrentRowHeight(getDynamicRowSize);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getCurrentCols() {
    for (const key in breakpoints) {
      if (windowSize.width === breakpoints[key]) {
        return cols[`${key}`];
      }
    }
  }

  function getDynamicRowSize() {
    const numOfCols = getCurrentCols();

    if (!numOfCols) {
      return 175; // fallback in case of error
    }

    return (windowSize.width - numOfCols * 10) / numOfCols - 1.5;
  }

  // layout is an array of objects, see the demo for more complete usage
  return (
    <div
      className="overflow-x-hidden bg-[#110e21] text-[#c4c5ea]"
      style={{ width: "100vw", height: "100vh" }}
    >
      <button onClick={() => adjustSize("8", 2, 1)}>Resize item 8</button>

      <ResponsiveGridLayout
        className="layout"
        cols={cols}
        breakpoints={breakpoints}
        layouts={currentLayout}
        width={windowSize.width}
        compactType="vertical"
        verticalCompact={true}
        onLayoutChange={(newLayout) => {
          if (currentLayout.xl !== newLayout) {
            setCurrentLayout({
              xl: newLayout,
            });
          }
        }}
      >
        <div
          key="111"
          style={{
            borderRadius: "2rem",
          }}
        >
          <div
            className="flex h-full flex-row justify-between gap-8 bg-gray-900/70 p-3"
            style={{
              borderRadius: "2rem",
              //aspectRatio: 2 / 1,
            }}
          >
            <div className="flex h-full flex-col justify-between">
              <img
                className="h-14 w-14 overflow-hidden object-cover"
                style={{ borderRadius: "1.4rem" }}
                src={
                  "https://imgs.search.brave.com/MMmOkchhxhGPcIDTpif9ud7kCm6t4Q5aUscYatv8jC4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzM3LzM1LzU5/LzM2MF9GXzgzNzM1/NTk1OF9Qdno2bHhC/VjZrdDJUNkYzWkRz/N1M3bWhaN2p1OFhQ/NC5qcGc"
                }
              />
              <div className="pb-2 ps-1">Instagram</div>
            </div>
            <div className="flex h-full flex-col justify-center">
              <div className="text-sm">
                hello this right here is an account that you should definetly
                follow right away - {links.length}
                {currentLayout.xl?.find((item) => item.i === "111")?.x ??
                  0} | {currentLayout.xl?.find((item) => item.i === "111")?.y}
              </div>
            </div>
          </div>
        </div>

        {currentLayout.xl &&
          currentLayout.xl
            .filter((item) => item.i !== "111")
            .map((item, index) => (
              <div key={item.i}>
                <LinkView currentLayout={currentLayout} setCurrentLayout={setCurrentLayout} layoutProps={item} item={links[index]} />
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

export function LinkView({
  item,
  layoutProps,
  currentLayout,
  setCurrentLayout
}: {
  item: links | undefined;
  layoutProps: Layout;
  currentLayout: LayoutStuff
  setCurrentLayout: Dispatch<React.SetStateAction<LayoutStuff>>
}) {
  const [colors, setColors] = useState<string[]>([]);
  const imageURL = item?.iconURL ?? undefined;
  const [label, setLabel] = useState(item?.name ?? "none");

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
  }, [imageURL]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="h-full text-white"
          style={{
            borderRadius: "2rem",
            background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          }}
        >
          <div
            className="flex h-full flex-col justify-between bg-gray-900/70 p-3"
            style={{
              borderRadius: "2rem",
              //aspectRatio: 1/1
            }}
          >
            <img
              className="h-14 w-14 overflow-hidden object-cover"
              style={{ borderRadius: "1.4rem" }}
              src={imageURL ?? undefined}
            />
            <div className="pb-2 ps-1">
              {item?.name ?? "none"} - {layoutProps.i}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent
        className="rounded-3xl text-[#c4c5ea]"
        style={{ backgroundColor: "#181725" }}
      >
        <input
          value={label}
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

        <div className="mx-5 mt-2 flex items-center justify-evenly bg-[#110e21] p-2" style={{borderRadius: "2rem"}}>
          <div className="aspect-square w-4/12">
            <div onClick={() => adjustSize(1,1)} className={`flex flex-col h-full w-full items-center justify-center rounded-3xl ${(layoutProps.w == 1) && "bg-[#d97fb0]/80"}`}>
              <Square />
              
              <div className="text-xs">small</div>
            </div>
          </div>
          <div className="aspect-square w-4/12">
            <div className="flex flex-col h-full w-full items-center justify-center rounded-3xl bg-[#d97fb0]/80">
              <RectangleHorizontal />
              <div className="text-xs">medium</div>
            </div>
          </div>
          <div className="aspect-square w-4/12">
            <div className="flex flex-col h-full w-full items-center justify-center rounded-3xl bg-[#d97fb0]/80">
              <Scan />
              <div className="text-xs">large</div>
            </div>
          </div>
        </div>
      </ContextMenuContent>
    </ContextMenu>
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
