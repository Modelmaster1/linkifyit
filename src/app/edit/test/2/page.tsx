"use client";
import {
  Link,
  LucideProps,
  Pen,
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
import { links } from "~/app/models";
import { getLinks } from "~/server/getUserItems";
import "~/styles/globals.css";

interface BreakpointsStuff {
  [P: string]: number;
}

export interface LayoutStuff {
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

  const otherProps = { w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2 };

  function getLayouts() {
    const numOfCols = getCurrentCols();
    if (!numOfCols) return;
    let result: LayoutStuff = {};
    let lastLink: Layout | null = null;

    links.forEach((link) => {
      const newX = lastLink?.x
        ? (lastLink.x ?? 0 === numOfCols - 1)
          ? 0
          : lastLink.x + 1
        : 0;
      const newY = lastLink?.y
        ? (lastLink.x ?? 0 === numOfCols - 1)
          ? lastLink.y + 1
          : lastLink.y
        : 0;

      const newItem = {
        i: String(link.id),
        x: newX,
        y: newY,
        ...otherProps,
      };

      result.xl?.push(newItem);
      lastLink = newItem;
    });

    console.log(result);

    return result;
  }

  function getCurrentCols() {
    for (const key in breakpoints) {
      if (windowSize.width === breakpoints[key]) {
        return cols[`${key}`];
      }
    }
  }

  var defaultLayouts: LayoutStuff = {
    xl: [
      { i: "0", x: 0, y: 0, ...otherProps },
      { i: "1", x: 1, y: 0, ...otherProps },
      { i: "2", x: 2, y: 0, ...otherProps },
      { i: "3", x: 3, y: 0, ...otherProps },
      { i: "4", x: 4, y: 0, ...otherProps },
      { i: "5", x: 5, y: 0, ...otherProps },
      { i: "6", x: 6, y: 0, ...otherProps },
      { i: "7", x: 7, y: 0, ...otherProps },
      { i: "8", x: 0, y: 1, ...otherProps },
      { i: "9", x: 1, y: 1, ...otherProps },
      { i: "10", x: 2, y: 1, ...otherProps },
      { i: "11", x: 3, y: 1, ...otherProps },
      { i: "111", x: 4, y: 1, ...otherProps, w: 2 },
    ],
  };

  const [currentLayout, setCurrentLayout] =
    useState<LayoutStuff>(defaultLayouts);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  var layouts: LayoutStuff = getLayouts()!;

  function handleResize(id: string, size: "small" | "medium" | "large") {
    const sizeMap = {
      small: { w: 1, h: 1 },
      medium: { w: 2, h: 1 },
      large: { w: 2, h: 2 },
    };

    const { w, h } = sizeMap[size];
    adjustSize(id, w, h);
  }

  function adjustSize(
    id: string,
    newW: number,
    newH: number,
    prevLayouts?: LayoutStuff,
  ) {
    const updatedLayouts = { ...prevLayouts };

    for (const breakpoint in updatedLayouts) {
      if (!updatedLayouts[breakpoint]) continue;

      updatedLayouts[breakpoint] = updatedLayouts[breakpoint].map((item) =>
        item.i === id ? { ...item, w: newW, h: newH } : item,
      );
    }

    return (updatedLayouts);
  }

  // layout is an array of objects, see the demo for more complete usage
  return (
    <div
      className="overflow-x-hidden bg-[#110e21] text-[#c4c5ea]"
      style={{ width: "100vw", height: "100vh" }}
    >
      <ResponsiveGridLayout
        className="layout"
        cols={cols}
        layouts={defaultLayouts}
        breakpoints={breakpoints}
        width={windowSize.width}
        compactType="vertical"
        verticalCompact={true}
        onLayoutChange={(newLayout) => {
          if (currentLayout.xl !== newLayout) {
            const resized8 = adjustSize("8", 2, 2, {xl: newLayout});
            setCurrentLayout({
              xl: resized8.xl ?? []
            });
          }
        }}
      >
        {currentLayout.xl &&
          currentLayout.xl
            .filter((item) => item.i !== "111")
            .map((item, index) => (
              <div key={item.i}>
                <LinkView
                  handleResize={handleResize}
                  currentLayout={currentLayout}
                  setCurrentLayout={setCurrentLayout}
                  layoutProps={item}
                  item={links[index]}
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

export function LinkView({
  item,
  layoutProps,
  currentLayout,
  setCurrentLayout,
  handleResize,
}: {
  item: links | undefined;
  layoutProps: Layout;
  currentLayout: LayoutStuff;
  setCurrentLayout: Dispatch<React.SetStateAction<LayoutStuff>>;
  handleResize: (id: string, size: "small" | "medium" | "large") => void;
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
            background: `${colors.length <= 0 ? "rgb(24 23 37 / 1)" : `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`}`,
          }}
        >
          <div
            className="flex h-full flex-col justify-between p-3"
            style={{
              borderRadius: "2rem",
              //aspectRatio: 1/1"
              background: "rgb(24 23 37 / 0.5)",
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
        className="rounded-3xl text-[#c4c5ea] drop-shadow-lg"
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
        <div className="mx-5 mt-4 text-base opacity-50">Actions</div>
        <div className="mx-5 mb-5 mt-2 flex flex-col gap-1 text-sm">
          <LinkContextAction name="Edit Link" Icon={Pen} />
          <LinkContextAction name="Remove Link from Page" Icon={X} />
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
