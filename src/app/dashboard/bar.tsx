"use client";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  Layers2,
  LifeBuoy,
  Link2,
  Mic,
  Paperclip,
  Pencil,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function DashboardBar({
  children
}: {
  children: React.ReactNode;
}) {

  const router = useRouter()
  function getTitle() {
    const path = usePathname()
    const lastItem = path.split("/").pop()

    switch (lastItem) {
        case "pages":
            return "Pages"
        case "settings":
            return "Settings"
        case "links":
            return "Links"
        default:
            return "Dashboard"
    }
    
}

  return (
    <TooltipProvider>
      <div className="grid h-screen w-full bg-black pl-[56px]">
        <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r border-neutral-200 dark:border-neutral-800">
          <div className="border-b border-neutral-200 p-2 dark:border-neutral-800">
            <Button variant="outline" size="icon" aria-label="Home">
              <Triangle className="fill-foreground size-5" />
            </Button>
          </div>
          <nav className="grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-muted rounded-lg"
                  onClick={() => router.push("/dashboard")}
                >
                  <Pencil className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Build a page
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => router.push("/dashboard/pages")}
                >
                  <Layers2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Pages
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => router.push("/dashboard/links")}
                >
                  <Link2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Links
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                >
                  <Settings2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                >
                  <LifeBuoy className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>

            <span>
              <SignedIn>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Account"
                >
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: {
                          width: "1.3rem",
                          height: "1.3rem",
                        },
                      },
                    }}
                  />
                </Button>
              </SignedIn>

              <SignedOut>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <SignInButton>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-auto rounded-lg"
                          aria-label="Account"
                        >
                          <User className="size-5" />
                        </Button>
                      </SignInButton>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Sign in
                  </TooltipContent>
                </Tooltip>
              </SignedOut>
            </span>
          </nav>
        </aside>
        <div className="flex flex-col">
          <header className="bg-background sticky top-0 z-10 flex h-[57px] bg-white dark:bg-black items-center gap-1 border-b border-neutral-200 px-4 dark:border-neutral-800">
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-1.5 text-sm"
            >
              <Share className="size-3.5" />
              Share
            </Button>
          </header>
          <div className="p-3 h-full">{children}</div>
        </div>
      </div>
    </TooltipProvider>
  );
}
