"use client";
import { Dispatch, SetStateAction } from "react";
import ReactGridLayout, { Layout } from "react-grid-layout";
import { CustomiseOptionsModel, links, pages } from "~/app/models";
import { LayoutStuff } from "../2/gridOptions";
import { LinkView } from "../2/ cGrid";
import { Plus } from "lucide-react";

export default function LinksSide({
  currentCustomisationOptions,
  nonSelectedLinks,
  selectLink,
}: {
  selectLink: (id: number | null) => void;
  nonSelectedLinks: links[];
  currentCustomisationOptions: CustomiseOptionsModel;
}) {
  function generateLayout() {
    var layout: Layout[] = [];

    for (let i = 0; i < nonSelectedLinks.length; i++) {
      const sID = String(nonSelectedLinks[i]?.id);
      const numOfCols = 2;

      layout.push({
        i: sID,
        static: true,
        x: i % numOfCols,
        y: Math.floor(i / numOfCols),
        w: 1,
        h: 1,
        isResizable: false,
        maxW: 2,
        maxH: 2,
      });
    }
    return layout;
  }

  return (
    <div className="minimal-scrollbar flex h-full w-[652px] flex-col gap-6 overflow-x-hidden rounded-3xl border border-[#9193b3]/20 bg-[#181726] p-4 pt-0">
      <div className="sticky top-0 z-10 -m-4 mb-4 flex items-center justify-between gap-1 bg-[#181726] px-4 py-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg">Links</div>
          <div className="text-sm opacity-70">
            Add links to your page. What are you waiting for?
          </div>
        </div>
        <button className="flex aspect-square items-center justify-center rounded-full text-[#9193b3]">
          <Plus size={25} />
        </button>
      </div>

      <LinkGrid
        layout={generateLayout()}
        selectLink={selectLink}
        selectedLinks={nonSelectedLinks}
        currentCustomisationOptions={currentCustomisationOptions}
      />
    </div>
  );
}

function LinkGrid({
  layout,
  selectedLinks,
  selectLink,
  currentCustomisationOptions,
}: {
  layout: Layout[];
  selectLink: (id: number | null) => void;
  selectedLinks: links[];
  currentCustomisationOptions: CustomiseOptionsModel;
}) {
  return (
    <ReactGridLayout
      cols={2}
      layout={layout}
      width={376}
      compactType="vertical"
      verticalCompact={true}
      containerPadding={[0, 0]}
    >
      {layout.map((item, index) => (
        <div key={item.i} className="relative">
          <LinkView
            editMode={true}
            currentCustomisationOptions={{
              ...currentCustomisationOptions,
              useAutoLinkTinting: false,
              defaultBackgroundColorForLinks: "rgb(145 147 179 / 0.1)",
            }}
            selectLink={selectLink}
            handleResize={() => {}}
            layoutProps={item}
            item={selectedLinks[index]}
          />
          <div className="absolute right-2 top-2 z-10">
            <button
              onClick={() => selectLink(selectedLinks[index]?.id ?? null)}
              className="rounded-full bg-[#d97fb0] p-3 text-white hover:bg-[#9193b3]"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </ReactGridLayout>
  );
}
