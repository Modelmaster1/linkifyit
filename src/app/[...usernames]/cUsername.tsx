"use client";
import { useEffect, useState } from "react";
import { CustomiseOptionsModel, InfoModel, links, UserInfo } from "../models";
import { LayoutStuff } from "../edit/test/2/gridOptions";
import GridPage from "../edit/test/2/page";
import { defaultCustomisationOptions } from "../edit/page";
import { getUserbyUsername } from "~/server/db/userActions";
import { getLinks, getPages } from "~/server/db/getUserItems";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "~/hooks/use-toast";
import { ToastAction, ToastActionElement } from "~/components/ui/toast";
import { useRouter } from "next/navigation";

const loadingLayout = {
  xl: [
    { i: "0", x: 0, y: 0, w: 2, h: 2, static: true },
    { i: "1", x: 2, y: 0, w: 2, h: 1, static: true },
    { i: "2", x: 2, y: 1, w: 1, h: 1, static: true },
  ],
};

export function ClientUsernamePage({
  username,
  pageSlug,
}: {
  username: string;
  pageSlug: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentInfo, setCurrentInfo] = useState<InfoModel | null>(null);
  const [currentCustomisationOptions, setCurrentCustomisationOptions] =
    useState<CustomiseOptionsModel>(defaultCustomisationOptions);
  const [currentLayout, setCurrentLayout] = useState<LayoutStuff | null>(loadingLayout);
  const [links, setLinks] = useState<links[]>([]);
  const [currentID, setCurrentID] = useState<string | null>(null);

  const currentUser = useClerk()?.user;

  const router = useRouter()

  useEffect(() => {
    getLinksAndPages();
  }, []);

  useEffect(() => {
    if (userInfo?.username == currentUser?.username) {
      toast({
        title: "Edit Page?",
        description: "Huh looks like this page is yours. Would you like to edit it?",
        action: <ToastAction altText="Edit" onClick={() => router.push(`/edit/${pageSlug}`)}>Edit</ToastAction>,
      });
    }
  }, [links]);

  async function getLinksAndPages() {
    const userInfo = await getUserbyUsername(username);
    if (!userInfo) {
      setLoading(false);
      return;
    }

    setUserInfo(userInfo.infoModel ?? null);

    const allLinks: links[] = await getLinks(userInfo.id);
    setLinks(allLinks);

    const allPages = await getPages(userInfo.id);
    const currentPage = allPages.find((p) => p.slug == pageSlug);

    if (!currentPage) {
      setLoading(false);
      return;
    }

    setCurrentInfo(currentPage);
    setCurrentCustomisationOptions(
      currentPage.customisationOptions ?? defaultCustomisationOptions,
    );

    if (currentPage.layout && currentPage.layout.xl) {
      let newLayout = currentPage.layout.xl.map((item) => ({
        ...item,
        isResizable: false,
        static: true,
      }));
      setCurrentLayout({ ...currentPage.layout, xl: newLayout });
    }

    setLoading(false);
  }

  return (
    <>
      <GridPage
        loading={loading}
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
      />
    </>
  );
}
