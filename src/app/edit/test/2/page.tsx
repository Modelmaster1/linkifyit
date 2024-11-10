"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyFirstGrid from "./ cGrid";
import {
  CustomiseOptionsModel,
  InfoModel,
  links,
  pages,
  UserInfo,
} from "~/app/models";
import { getLinks } from "~/server/db/getUserItems";
import { Layout, Layouts } from "react-grid-layout";
import { breakpoints, cols, LayoutStuff } from "./gridOptions";
import "~/styles/globals.css";
import { SignedOut, SignUpButton, useClerk } from "@clerk/nextjs";
import { defaultCustomisationOptions } from "../../page";
import { CSSProperties } from "styled-components";

export default function GridPage({
  links,
  userInfo,
  loading,
  customisationOptions,
  selectedLinks,
  infoModel,
  currentLayout,
  setCurrentLayout,
  unselectLink,
}: {
  links: links[];
  selectedLinks?: number[];
  loading?: boolean; // This specifies that the grid is either in edit mode (==undefined) or in view mode (==defined)
  customisationOptions: CustomiseOptionsModel;
  userInfo: UserInfo;
  infoModel: InfoModel | null;
  currentLayout: LayoutStuff | null;
  setCurrentLayout: Dispatch<SetStateAction<LayoutStuff | null>>;
  unselectLink?: (id: number | null) => void;
}) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // will be removed later

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    generateLayout();
  }, [links]);

  function getCurrentCols() {
    // Use Math.min and Math.max to get the closest breakpoint value
    const targetBreakpoint = Object.keys(breakpoints).reduce((a, b) =>
      breakpoints[a]! <= windowSize.width ? a : b,
    );

    if (targetBreakpoint in cols) {
      return {
        cols: cols[`${targetBreakpoint}`],
        breakpoint: targetBreakpoint,
      };
    }
  }

  function generateLayout() {
    var allLayouts: LayoutStuff = {
      xl: [],
      xs: [],
      xxs: [],
    };

    var layout: Layout[] = [];

    const layoutData = getCurrentCols();
    const numOfCols = layoutData?.cols ?? 0;
    const oldLayout = currentLayout?.xl;

    for (let i = 0; i < (selectedLinks ?? links).length; i++) {
      const sID = String(links[i]?.id);
      const oldItem = oldLayout?.find((item) => item.i == sID);

      layout.push({
        i: sID,
        x: oldItem?.x ?? i % numOfCols,
        y: oldItem?.y ?? Math.floor(i / numOfCols),
        w: 1,
        h: 1,
        isResizable: true,
        maxW: 2,
        maxH: 2,
      });
    }

    allLayouts.xl = layout;
    return allLayouts;
  }

  function handleResize(id: string, size: "small" | "medium" | "large") {
    const currentItem = currentLayout?.xl?.find((item) => item.i == id);
    if (!currentItem) return;

    const sizeMap = {
      small: { newW: 1, newH: 1 },
      medium: { newW: 2, newH: 1 },
      large: { newW: 2, newH: 2 },
    };

    const { newW, newH } = sizeMap[size];
    const newLayoutItem: Layout = { ...currentItem, w: newW, h: newH };
    setCurrentLayout({
      ...currentLayout,
      xl:
        currentLayout?.xl?.map((item) =>
          item.i == id ? newLayoutItem : item,
        ) ?? [],
    });
  }

  function saveLayout(newLayout: Layout[]) {
    if (currentLayout?.xl !== newLayout) {
      setCurrentLayout({
        xl: newLayout,
      });
    }
  }

  return (
    <div
      className="min-h-screen text-[#c4c5ea]"
      style={{
        backgroundColor: customisationOptions.backgroundColor,
        paddingBottom: "40px",
      }}
    >
      <div
        className={`flex flex-col gap-2 overflow-x-auto ${loading == true && "animate-pulse"}`}
      >
        <div
          className="flex flex-col gap-4"
          style={{
            marginLeft: "80px",
            marginRight: "80px",
            marginTop: "80px",
            marginBottom: "20px",
          }}
        >
          <div className="flex flex-col items-center gap-4 md:gap-8 lg:flex-row">
            <div className="bg-[#181724]" style={{ borderRadius: "2.5rem" }}>
              <img
                src={infoModel?.imageURL ?? userInfo.imageUrl ?? undefined}
                className="aspect-square h-[120px] object-cover outline outline-2 outline-[#9193b3]/50 md:h-[150px]"
                style={{
                  borderRadius: "2.5rem",
                  opacity: userInfo.imageUrl ? 1 : 0,
                }}
              />
            </div>

            <div className="flex w-[500px] max-w-full flex-col items-center gap-2 text-center lg:items-start lg:text-start">
              <div
                className="text-xl font-medium md:text-3xl"
                style={{
                  background: userInfo.username ? "transparent" : "#181724",
                  color: userInfo.username ? undefined : "#181724",
                  borderRadius: "2rem",
                }}
              >
                {infoModel?.overrideName ??
                  userInfo.fullName ??
                  userInfo.username ??
                  "User has not loaded yet..."}
              </div>
              <div className="text-sm opacity-70 md:text-base">
                {infoModel?.description ?? null}
              </div>
            </div>
          </div>
        </div>
        <div className={userInfo.username ? "relative" : undefined}>
          <MyFirstGrid
            editMode={loading == undefined}
            currentCustomisationOptions={customisationOptions}
            handleResize={handleResize}
            links={links}
            unselectLink={unselectLink}
            windowSize={windowSize}
            layout={currentLayout ?? generateLayout()}
            saveLayout={saveLayout}
          />
          {loading == false && !infoModel && (
            <div
              className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
              style={{
                backgroundColor: "rgb(17 14 33 / 0.4)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl font-semibold">
                  {!userInfo.username
                    ? "The username you're looking for doesn't exist."
                    : "The page you're looking for doesn't exist."}
                </div>
                <div className="text-base opacity-80">
                  {!userInfo.username
                    ? "Looks like this username is still available... Claim it before it is to late!"
                    : "Huh... This page doesn't exist. Make sure you spelled the name correctly."}
                </div>
                {!userInfo.username && (
                  <SignedOut>
                    <SignUpButton />
                  </SignedOut>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//fix resizing isssue when sizing up. Problem = oldLayout in generate layout...
