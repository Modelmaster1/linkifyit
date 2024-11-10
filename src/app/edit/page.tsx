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
import GridPage, { GridPageProps } from "./test/2/page";
import CustomiseOptions from "./test/_comps/customise";
import { OptionsViewModelType } from "./test/_comps/options";
import LinksSide from "./test/_comps/linksSide";
import PageInfoView from "./test/_comps/pageInfo";
import { updatePage, updatePageScreenshot } from "~/server/db/pageActions";
import { LayoutStuff } from "./test/2/gridOptions";
import HeaderCarousel from "./test/_comps/headerCarousel";
import { useRouter } from "next/navigation";
import { captureGridAndUpload } from "~/server/getScreenshot";
import { info } from "console";

export const defaultCustomisationOptions: CustomiseOptionsModel = {
  // make these the correnct ones
  style: "grid",
  backgroundColor: "#110e21",
  defaultBackgroundColorForLinks: "#181724",
  useAutoLinkTinting: true,
  font: "Inter",
  textColor: "#FFFFFF",
};

export default function EditPage({
  selectedPageSlug,
}: {
  selectedPageSlug?: string;
}) {
  const [searchFocus, setSearchFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPage, setSelectedPage] = useState<pages | null>(null);
  const [pages, setPages] = useState<pages[]>([]);
  const [links, setLinks] = useState<links[]>([]);

  const userInfo = useClerk()?.user;
  const router = useRouter();

  function focusInput() {
    inputRef.current?.focus();
  }

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
          <div className="flex h-screen max-h-screen minimal-scrollbar flex-col gap-4 overflow-auto px-5 pb-40">
            <div className="mt-10 font-bold opacity-80">All pages</div>

            <div className="flex flex-wrap gap-4">
              {pages.map((p) => (
                <button
                  key={p.id}
                  className="flex w-[300px] flex-col gap-2 rounded-3xl p-4 text-left outline outline-2 outline-[#2b2b31]/70"
                  onClick={() => {
                    setSelectedPage(p);
                  }}
                >
                  <div className="h-[200px] w-full">
                    {p.screenshot ? (
                      <img draggable={false} className="h-full pt-1 w-full object-contain rounded-3xl overflow-hidden" style={{backgroundColor: p.customisationOptions?.backgroundColor}} src={p.screenshot ?? undefined} />
                    ) : (
                      <div className="text-xs h-full w-full flex justify-center items-center">No Preview</div>
                    )}

                  </div>
                  
                  <div className="text-lg font-semibold">/{p.slug}</div>
                  <div className="line-clamp-1 text-sm opacity-80">
                    {p.description}
                  </div>
                </button>
              ))}
              <button className="flex w-[400px] flex-col items-center justify-center gap-4 rounded-3xl p-4 text-left opacity-70 outline-dashed outline-2 outline-[#2b2b31]">
                <div className="flex flex-col items-center gap-2">
                  <Plus className="size-6" />
                  <div className="">New page</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
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

  const [currentViewType, setCurrentViewType] =
    useState<OptionsViewModelType>(null);

  async function update() {
    const newPage = getNewPage();
    if (!newPage) return;

    const model: GridPageProps =
      {
        infoModel: currentInfo,
        loading: false,
        customisationOptions: currentCustomisationOptions,
        currentLayout: currentLayout,
        userInfo: {
          fullName: userInfo?.fullName ?? null,
          imageUrl: userInfo?.imageUrl ?? null,
          username: userInfo?.username ?? null,
        },
        links: links,
        selectedLinks: selectedLinks,
      }

    await updatePage(newPage);

    const url = await captureGridAndUpload(`/${userInfo?.username}/${currentInfo?.slug}`)
    console.log("url", url)
    if (!url) return
    if (!selectedPage) return
    await updatePageScreenshot(selectedPage.id, url)
    alert("All Done... You can exit the editor now")
  }

  function getNewPage() {
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

    return newPage;
  }

  function selectLink(id: number | null) {
    if (!id) return;
    setCurrentLayout({
      ...currentLayout,
      xl: [
        ...(currentLayout?.xl ?? []),
        {
          i: String(id),
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          isResizable: true,
          maxW: 2,
          maxH: 2,
        },
      ],
    });
    setSelectedLinks([...selectedPage?.links, id]);
  }

  function unselectLink(id: number | null) {
    if (!id) return;
    setCurrentLayout({
      ...currentLayout,
      xl: currentLayout?.xl?.filter((l) => l.i !== String(id)) ?? [],
    });
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
    <div className="flex h-[calc(100vh-84px)] w-full">
      {currentCustomisationOptions !== selectedPage.customisationOptions && (
        <div className="absolute bottom-10 right-10 z-10 rounded-3xl bg-[#181724] p-4 text-xs outline outline-[#110e21]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-base opacity-90">Looks Awesome!</div>

              <div className="opacity-50">You have unsaved changes</div>
            </div>
            <button
              className="rounded-full bg-[#d97fb0] p-3 text-white hover:bg-[#9193b3]"
              onClick={(e) => {
                e.preventDefault();
                update();
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      )}

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
