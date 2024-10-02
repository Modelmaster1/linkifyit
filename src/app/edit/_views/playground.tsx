"use client";
import React, {
  FC,
  useState,
  useCallback,
  forwardRef,
  HTMLAttributes,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
};
import { Link, LucideProps, Pen, Plus, Trash2, X } from "lucide-react";
import { links, pages } from "~/app/models";
import { Item } from "@radix-ui/react-select";

interface PlaygroundProps {
  links: links[];
  pages: pages[];
}

export default function Playground({ links, pages }: PlaygroundProps) {
  const [selectedPage, setSelectedPage] = useState<pages | null>(null);

  function filterLinks() {
    return links.filter(
      (link) => selectedPage?.links.includes(link.id) ?? false,
    );
  }

  const [items, setItems] = useState(
    Array.from({ length: 20 }, (_, i) => (i + 1).toString()),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(String(active.id));
        const newIndex = items.indexOf(String(over!.id));

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <div className="flex h-[calc(100vh-84px)] justify-between">
      <div className="minimal-scrollbar flex max-h-[calc(vh-84px)] w-[350px] flex-col gap-4 overflow-y-auto overflow-x-hidden pe-4">
        <div className="flex flex-col gap-4 rounded-3xl bg-[#181726] p-4">
          <div className="text-md font-semibold">Page</div>
          <select
            className="w-full rounded-full bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
            value={selectedPage?.id ?? ""}
            onChange={(e) =>
              setSelectedPage(
                pages.find((p) => p.id === parseInt(e.target.value)) ?? null,
              )
            }
          >
            {pages.map((p) => {
              return (
                <option key={p.id} value={p.id}>
                  {p.overrideName ?? "No Name"} - /{p.slug}
                </option>
              );
            })}
          </select>
          <div className="w-full">
            <div className="mb-2 text-sm">Slug</div>
            <input
              value={selectedPage?.slug ?? ""}
              onChange={(e) =>
                setSelectedPage(
                  selectedPage
                    ? { ...selectedPage, slug: e.target.value }
                    : null,
                )
              }
              className="w-full rounded-3xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
            />
          </div>
          <div className="w-full">
            <div className="mb-2 text-sm">Override Name</div>
            <input
              value={selectedPage?.overrideName ?? ""}
              onChange={(e) =>
                setSelectedPage(
                  selectedPage
                    ? { ...selectedPage, overrideName: e.target.value }
                    : null,
                )
              }
              className="w-full rounded-3xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
            />
          </div>
          <div className="w-full">
            <div className="mb-2 text-sm">Description</div>
            <textarea
              value={selectedPage?.description ?? ""}
              onChange={(e) =>
                setSelectedPage(
                  selectedPage
                    ? { ...selectedPage, description: e.target.value }
                    : null,
                )
              }
              className="w-full rounded-3xl bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-[#181726] p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-md font-semibold">Links</div>
            <Plus size={20} className="cursor-pointer hover:opacity-50" />
          </div>
          <div className="flex flex-col gap-4">
            {filterLinks().map((link) => (
              <LinkCom
                link={link}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-fill mb-3 me-3 flex w-full flex-col gap-4 rounded-3xl bg-[#181726] p-5">
        <div className="text-xl font-semibold">Make it look Awesome!</div>
        <div className="flex flex-col gap-2">
          <div
            className="w-fill rounded-2xl bg-red-500 outline"
            style={{ aspectRatio: 16 / 10 }}
          >
          </div>
          <div className="max-w-[800px] text-xs opacity-80">
            No Explanation Needed. You'll figure it out!
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkCom({
  link,
  setSelectedPage,
  selectedPage,
}: {
  link: links;
  setSelectedPage: Dispatch<SetStateAction<pages | null>>;
  selectedPage: pages | null;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div key={link.id} className="flex items-center gap-4">
        <div className="flex aspect-square h-10 items-center justify-center rounded-full bg-[#9193b3]/20 text-white/50 outline outline-[#9193b3]/50">
          <Link className="m-auto" size={20} />
        </div>
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="text-sm font-semibold">{link.name}</div>
          <div className="line-clamp-1 overflow-hidden text-xs text-[#9193b3]">
            {link.url}
          </div>
        </div>
        {isHovering && selectedPage && (
          <X
            size={20}
            className="cursor-pointer hover:opacity-80"
            onClick={() =>
              setSelectedPage({
                ...selectedPage,
                links: selectedPage.links.filter((l) => l !== link.id),
              })
            }
          />
        )}
      </div>
    </div>
  );
}
