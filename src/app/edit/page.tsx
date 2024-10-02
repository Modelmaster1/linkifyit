"use client";
import { SignedIn, useClerk, UserButton } from "@clerk/nextjs";
import {
  FileText,
  Hash,
  Layers2,
  Link,
  Link2,
  LucideProps,
  Menu,
  Paintbrush,
  Plus,
  Search,
} from "lucide-react";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import Playground from "./_views/playground";
import { links, pages } from "../models";
import { getLinks, getPages } from "~/server/getUserItems";

export default function EditPage() {
  const [searchFocus, setSearchFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const [pages, setPages] = useState<pages[]>([]);
  const [links, setLinks] = useState<links[]>([]);

  const userID = useClerk()?.user?.id;

  useEffect(() => {
    fetchPages();
    fetchLinks()
  }, [userID]);

  async function fetchPages() {
    if (!userID) {
      console.log("no id");
      return;
    }
    const result = await getPages(userID);
    setPages(result);
  }

  async function fetchLinks() {
    if (!userID) {
      console.log("no id");
      return;
    }
    const result = await getLinks(userID);
    setLinks(result);
  }

  return (
    <div className="h-full min-h-screen bg-[#110e21] text-[#c4c5ea]">
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex w-full items-center gap-16">
          <div className="flex items-center gap-4">
            <div className="flex aspect-square h-10 items-center justify-center rounded-full bg-[#9193b3]/70 text-white outline outline-[#9193b3]/50">
              <Link className="m-auto" size={20} />
            </div>
            <div className="font-semibold">LinkifyIT</div>
          </div>
          <div
            onClick={focusInput}
            className={`flex w-6/12 items-center gap-2 rounded-full bg-[#181726] p-3 ${searchFocus && "outline"} outline-2 outline-[#d97fb0]`}
          >
            <Search className="size-5 cursor-pointer" />
            <input
              type="text"
              ref={inputRef}
              className="w-full bg-transparent outline-none focus:outline-none"
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Try Searching..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-4 rounded-full bg-[#181726] p-3">
              <Menu className="size-5 cursor-pointer" />
              <UserButton />
            </div>
          </SignedIn>
          <div className="cursor-pointer rounded-full bg-[#d97fb0] p-3 text-white hover:bg-[#9193b3]">
            <Plus className="size-5" />
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-84px)] w-full">
        <div className="mx-4 flex flex-col justify-between py-6">
          <div className="flex flex-col gap-4">
            <PageButton name="Customize" icon={Paintbrush} />
            <PageButton name="Pages" icon={Layers2} />
            <PageButton name="Links" icon={Link2} />
          </div>
          <div className="flex flex-col gap-4">
            <PageButton name="What's new" icon={Hash} />
            <PageButton name="Docs" icon={FileText} />
          </div>
        </div>

        <div className="min-h-full w-full">
          <Playground links={links} pages={pages} />
        </div>

      </div>
    </div>
  );
}

interface PageButtonProps {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

function PageButton({ name, icon: Icon }: PageButtonProps) {
  return (
    <div className="tooltip">
      <div className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-full bg-[#181726] text-[#9193b3] hover:bg-[#333151] hover:text-white">
        <Icon size={20} />
      </div>
      <div className="tooltiptext w-auto"><div className="ms-3 flex h-10 items-center p-2 px-4 rounded-full outline-[#9193b3]/20 text-sm bg-[#110e21] outline justify-center w-fit">{name}</div></div>
    </div>
  );
}
