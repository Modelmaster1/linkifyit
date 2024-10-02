"use client";
import { ClipboardPaste, Cog, Image, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  extractMainDomain,
  stripProtocolAndExtension,
} from "../_functions/formatURLs";
import {
  addLinkToDatabase,
  updateLinkInDatabase,
} from "../_functions/databaseFunctions";
import Link from "next/link";
import { Switch } from "~/components/ui/switch";
import { link } from "./models";

interface LinkPopUpProps {
  onClose?: () => void;
  oldLink?: link | null;
  useIconTrigger?: boolean;
}

export function AddLinkPopUp({
  onClose,
  oldLink = null,
  useIconTrigger = false,
}: LinkPopUpProps) {
  const [useURLMetadata, setUseURLMetadata] = useState(true);
  const [name, setName] = useState(oldLink?.name ?? "");
  const [imageURL, setImageURL] = useState(oldLink?.iconURL ?? "");
  const [url, setURL] = useState(oldLink?.url ?? "");

  const router = useRouter();

  async function quickAdd() {
    const strippedURL = stripProtocolAndExtension(url, false);

    if (name.length <= 0) {
      setName(strippedURL);
    }
  }

  function close() {
    if (onClose) {
      onClose();
    }
  }

  async function pasteContent(updateLink: boolean) {
    try {
      const text = await navigator.clipboard.readText();
      if (updateLink) {
        setURL(text);
        const strippedURL = stripProtocolAndExtension(text, false);
        const hostname = extractMainDomain(text);
        setName(strippedURL);
        setImageURL("https://logo.clearbit.com/" + hostname);
      } else {
        setImageURL(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }

  async function addORUpdateLink() {
    if (oldLink) {
      const newLink: link = {
        id: oldLink.id,
        name: name,
        description: oldLink.description, //this doesn't matter
        ownerID: oldLink.ownerID,
        createdAt: oldLink.createdAt, //this doesn't matter
        updatedAt: oldLink.updatedAt, //this doesn't matter
        url: url,
        iconURL: imageURL,
        isHidden: oldLink.isHidden, //this doesn't matter (right now)
      };

      updateLinkInDatabase(newLink);
    } else {
      addLinkToDatabase(name, url, imageURL, false);
    }

    clearFields();
    router.refresh();
  }

  function clearFields() {
    setName("");
    setURL("");
    setImageURL("");
  }

  function handlePasteButonClick(e: any, updateLink: boolean = true) {
    e.preventDefault();
    pasteContent(updateLink);
  }

  function handleNameChange(newName: string) {
    setName(newName);
  }

  const updateUseURLMetadata = async () => {
    setUseURLMetadata(!useURLMetadata);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {useIconTrigger ? (
          <Button variant="ghost" size="icon" className="rounded-xl">
            <div className="dark:text-[#9da3ae]">
              <Pen className="h-4 w-4" />
            </div>
          </Button>
        ) : (
          <div className="flex cursor-pointer gap-2 p-1 opacity-70">
            <Cog />
            <span>Advanced</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="outline outline-1 outline-gray-500 dark:bg-gray-900 dark:text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Link</DialogTitle>
          <DialogDescription>
            You know what this what a link is for...
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            className="w-full"
            placeholder="ex: youtube"
            defaultValue={oldLink?.name ?? ""}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                placeholder="https://example.com - Your Link goes here"
                onChange={(e) => setURL(e.target.value)}
                defaultValue={oldLink?.url ?? ""}
                value={url}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => handlePasteButonClick(e)}
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-1 text-sm opacity-60">
            Are you a <div className="font-bold">Power User?</div>
            <Link
              href={"/docs/power-links"}
              className="underline underline-offset-2"
            >
              Check out Power Links
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-gray-100 p-2 dark:bg-[#030616]">
          <div className="flex items-center gap-4">
            {imageURL.length > 10 ? (
              <img
                src={imageURL}
                className="aspect-square h-20 w-auto rounded-xl"
              />
            ) : (
              <div className="flex aspect-square h-20 min-h-20 items-center justify-center rounded-xl bg-gray-300 dark:bg-[#20293a]">
                <Image className="opacity-80" />
              </div>
            )}
            <div className="">
              <div>
                <div className="text-base font-semibold">Link Image</div>
                <span className="text-sm opacity-60">
                  An image can help users understand what the link is for.
                  Obviously.
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm">Use the links (Metadata) image</div>
            <Switch checked={useURLMetadata} onClick={updateUseURLMetadata} />
          </div>
          <div className="flex space-x-2">
            <Input
              id="imageURL"
              type="text"
              className="w-full"
              placeholder="Image URL"
              value={imageURL}
              defaultValue={oldLink?.iconURL ?? ""}
              onChange={(e) => setImageURL(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => handlePasteButonClick(e, false)}
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter className="flex w-full justify-end">
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                size="veryRounded"
                variant="secondary"
                onClick={close}
              >
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                size="veryRounded"
                variant="default"
                onClick={() => {
                  addORUpdateLink();
                }}
              >
                {oldLink ? "Save Changes" : "Add Link"}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
