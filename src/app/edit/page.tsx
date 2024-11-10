"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
} from "@clerk/nextjs";
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
import {
  CustomiseOptionsModel,
  InfoModel,
  links,
  pages,
  UserInfo,
} from "../models";
import { getLinks, getPages } from "~/server/db/getUserItems";
import GridPage from "./test/2/page";
import CustomiseOptions from "./test/_comps/customise";
import { OptionsViewModelType } from "./test/_comps/options";
import LinksSide from "./test/_comps/linksSide";
import PageInfoView from "./test/_comps/pageInfo";
import { updatePage } from "~/server/db/pageActions";
import { LayoutStuff } from "./test/2/gridOptions";

export const defaultCustomisationOptions: CustomiseOptionsModel = {
  // make these the correnct ones
  style: "grid",
  backgroundColor: "#110e21",
  defaultBackgroundColorForLinks: "#181724",
  useAutoLinkTinting: true,
  font: "Inter",
  textColor: "#FFFFFF",
};

export default function EditPage({selectedPageSlug}: {selectedPageSlug?: string}) {
  const [selectedPage, setSelectedPage] = useState<pages | null>(null);
  const [pages, setPages] = useState<pages[]>([]);
  const [links, setLinks] = useState<links[]>([]);

  const userInfo = useClerk()?.user;

  useEffect(() => {
    fetchLinks();
    fetchPages();
  }, [userInfo]);

  async function fetchPages() {
    if (!userInfo) {
      console.log("no id");
      return;
    }
    const result = await getPages(userInfo.id);
    setPages(result);
    if (selectedPageSlug) {
      setSelectedPage(result.find((p) => p.slug == selectedPageSlug) ?? null);
    }
  }

  async function fetchLinks() {
    if (!userInfo) {
      console.log("no id");
      return;
    }
    const result = await getLinks(userInfo.id);
    setLinks(result);
  }

  return (
    <>
      {selectedPage ? (
        <ClientEditPage
          selectedPage={selectedPage}
          links={links}
          userInfo={{
            fullName: userInfo?.fullName ?? null,
            imageUrl: userInfo?.imageUrl ?? null,
            username: userInfo?.username ?? null,
          }}
        />
      ) : (
        <div>
        <div>loading</div>
        <select
            className="w-full rounded-full bg-[#181726] p-2 text-sm text-white outline outline-[#9193b3]/20"
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
          </div>
      )}
    </>
  );
}

function ClientEditPage({
  selectedPage,
  links,
  userInfo,
}: {
  selectedPage: pages;
  links: links[];
  userInfo: UserInfo;
}) {
  const [searchFocus, setSearchFocus] = useState(false);

  const [currentLayout, setCurrentLayout] = useState<LayoutStuff | null>(
    selectedPage.layout,
  );
  const [currentCustomisationOptions, setCurrentCustomisationOptions] =
    useState<CustomiseOptionsModel>(
      selectedPage.customisationOptions ?? defaultCustomisationOptions,
    );
  const [selectedLinks, setSelectedLinks] = useState<number[]>(
    selectedPage.links,
  );
  const [currentInfo, setCurrentInfo] = useState<InfoModel | null>(
    selectedPage,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const [currentViewType, setCurrentViewType] =
    useState<OptionsViewModelType>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  async function update() {
    if (!currentInfo) return;
    const newPage: pages = {
      ...selectedPage,

      slug: currentInfo.slug,
      overrideName: currentInfo.overrideName,
      description: currentInfo.description,
      imageURL: currentInfo.imageURL,

      links: selectedLinks,
      customisationOptions: currentCustomisationOptions,
      layout: currentLayout,
    
    };

    await updatePage(newPage);
    alert("Updated");
  }

  function selectLink(id: number | null) {
    if (!id) return;
    setCurrentLayout({...currentLayout, xl: [...currentLayout?.xl ?? [], {i: String(id), x: 0, y: 0, w: 1, h: 1, isResizable: true, maxW: 2, maxH: 2}]});
    setSelectedLinks([...selectedPage?.links, id]);
  }

  function unselectLink(id: number | null) {
    if (!id) return;
    setCurrentLayout({...currentLayout, xl: currentLayout?.xl?.filter((l) => l.i !== String(id)) ?? []});
    setSelectedLinks(selectedPage?.links.filter((l) => l !== id));
  }

  function getCurrentOptionsView() {
    if (!currentInfo) return null;

    const optionViews = {
      Customize: (
        <CustomiseOptions
          currentData={currentCustomisationOptions}
          setCurrentData={setCurrentCustomisationOptions}
        />
      ),
      Page: (
        <PageInfoView
          userInfo={userInfo}
          setCurrentInfo={setCurrentInfo}
          currentInfo={currentInfo}
        />
      ),
      Link: (
        <LinksSide
          selectLink={selectLink}
          nonSelectedLinks={filterLinks("nonSelected")}
          currentCustomisationOptions={currentCustomisationOptions}
        />
      ),
    };

    return currentViewType ? optionViews[currentViewType] : null;
  }

  function toggleView(view: OptionsViewModelType) {
    setCurrentViewType(currentViewType === view ? null : view);
  }

  function filterLinks(type: "nonSelected" | "selected" = "selected") {
    const conditionMap = {
      nonSelected: (link: links) => !selectedLinks.includes(link.id),
      selected: (link: links) => selectedLinks.includes(link.id),
    };
    return links.filter((link) => conditionMap[type](link));
  }

  return (
    <div className="h-full max-h-screen overflow-y-hidden bg-[#110e21] text-[#c4c5ea]">
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex w-full items-center gap-16">
          <div className="flex items-center gap-4">
            <div className="flex aspect-square h-10 items-center justify-center rounded-full bg-[#9193b3]/70 text-white outline outline-[#9193b3]/50">
              <Link className="m-auto" size={20} />
            </div>
            <div className="text-xl font-semibold">LinkifyIT</div>
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

        <button
          onClick={(e) => {
            e.preventDefault();
            update();
          }}
          className="mx-4 cursor-pointer rounded-3xl bg-[#3f7c7a] p-2"
        >
          update
        </button>

        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-4 rounded-full bg-[#181726] p-3">
              <Menu className="size-5 cursor-pointer" />
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <div className="cursor-pointer rounded-full bg-[#d97fb0] p-3 text-white hover:bg-[#9193b3]">
            <Plus className="size-5" />
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-84px)] w-full">
        <div className="ms-4 flex flex-col justify-between py-6">
          <div className="flex flex-col gap-4">
            <PageButton
              name="Customize"
              selectedState={currentViewType === "Customize"}
              icon={Paintbrush}
              action={() => toggleView("Customize")}
            />
            <PageButton
              name="Page"
              selectedState={currentViewType === "Page"}
              icon={Layers2}
              action={() => toggleView("Page")}
            />
            <PageButton
              name="Link"
              selectedState={currentViewType === "Link"}
              icon={Link2}
              action={() => toggleView("Link")}
            />
          </div>
          <div className="flex flex-col gap-4">
            <PageButton name="What's new" icon={Hash} />
            <PageButton name="Docs" icon={FileText} />
          </div>
        </div>

        {getCurrentOptionsView()}

        <div className="minimal-scrollbar ms-5 min-h-full w-full overflow-y-auto rounded-3xl border-2 border-[#181726]">
          <GridPage
            unselectLink={unselectLink}
            infoModel={currentInfo}
            customisationOptions={currentCustomisationOptions}
            currentLayout={currentLayout}
            setCurrentLayout={setCurrentLayout}
            userInfo={{
              fullName: userInfo?.fullName ?? null,
              imageUrl: userInfo?.imageUrl ?? null,
              username: userInfo?.username ?? null,
            }}
            links={links}
            selectedLinks={selectedLinks}
          />
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
  action?: () => void;

  selectedState?: boolean;
}

function PageButton({
  name,
  icon: Icon,
  action,
  selectedState,
}: PageButtonProps) {
  const selectedCSS = {
    width: "3rem",
    height: "3rem",
    background: "rgb(145 147 179 / 0.2)",
    borderTopRightRadius: "0%",
    borderBottomRightRadius: "0%",
  };

  return (
    <div className="tooltip">
      <div
        className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-full bg-[#181726] text-[#9193b3] hover:bg-[#9193b3]/20 hover:text-white"
        style={selectedState ? selectedCSS : { marginInlineEnd: "0.5rem" }}
        onClick={action}
      >
        <Icon size={20} />
      </div>
      <div className="tooltiptext w-auto">
        <div className="ms-3 flex h-10 w-fit items-center justify-center rounded-full bg-[#110e21] p-2 px-4 text-sm outline outline-[#9193b3]/20">
          {name}
        </div>
      </div>
    </div>
  );
}
