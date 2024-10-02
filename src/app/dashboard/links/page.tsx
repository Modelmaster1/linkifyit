"use client";
import { useClerk } from "@clerk/nextjs";
import { Delete, Pen, Trash2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { links, pages } from "~/app/models";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getLinks, getPages } from "~/server/getUserItems";

export default function LinkPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<links[]>([]);
  const [filteredItems, setFilteredItems] = useState<links[]>([]);
  const [search, setSearch] = useState<string>("");
  const userID = useClerk()?.user?.id;

  useEffect(() => {
    fetchItems();
  }, [userID]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) => {
        return (item.name ?? item.url)
          .toLowerCase()
          .includes(search.toLowerCase());
      }),
    );
  }, [search]);

  async function fetchItems() {
    if (!userID) {
      console.log("no id");
      return;
    }
    const result = await getLinks(userID);
    setItems(result);
    setFilteredItems(result);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="opacity-80 lg:w-8/12">
        We use links... Revolutionary I know.
      </div>
      <div className="sticky top-[54px] z-10 flex items-center justify-between gap-4 bg-white py-4 dark:bg-black lg:w-8/12">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Button variant="default">Add</Button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="flex h-full flex-col gap-2 overflow-auto">
          {filteredItems.length === 0 && (
            <div className="flex animate-pulse flex-col gap-2">
              <div className="min-h-[100px] w-full rounded-md border border-neutral-200 bg-neutral-900 dark:border-neutral-800" />
              <div className="min-h-[100px] w-full rounded-md border border-neutral-200 bg-neutral-900 dark:border-neutral-800" />
              <div className="min-h-[100px] w-full rounded-md border border-neutral-200 bg-neutral-900 dark:border-neutral-800" />
            </div>
          )}
          {filteredItems.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <div className="flex gap-4 items-center">
                {(item.iconURL) ? (
                    <img src={item.iconURL} className="h-20 aspect-square rounded-md" />
                ) : (
                    <div className="h-20 aspect-square bg-neutral-800 rounded-md"/>
                )}
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-semibold opacity-80">
                    {item.name}
                  </div>
                  <div className="text-sm opacity-80">{item.url}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Pen className="size-5" />
                </Button>
                <Button variant="destructive">
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
