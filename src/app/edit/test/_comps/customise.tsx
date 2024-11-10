"use client";
import {
  ChevronDown,
  LayoutPanelTop,
  List,
  LucideProps,
  Rows3,
} from "lucide-react";
import Image from "next/image";
import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CustomiseOptionsModel, pages } from "~/app/models";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { CSSProperties } from "styled-components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import getReadableTextColor from "~/server/getReadableTextColor";
import { Checkbox } from "~/components/ui/checkbox";
import { set } from "lodash";
import { defaultCustomisationOptions } from "../../page";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Ensure hex is valid and starts with '#'
  const validHex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  if (!validHex.test(hex)) return null;

  // Remove the '#' if it exists
  hex = hex.replace(/^#/, "");

  // Convert shorthand (3-digit) hex to 6-digit
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the r, g, and b components
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return { r, g, b };
}

export default function CustomiseOptions({
  currentData,
  setCurrentData,
}: {
  currentData: CustomiseOptionsModel;
  setCurrentData: Dispatch<SetStateAction<CustomiseOptionsModel>>;
}) {
  const [color, setColor] = useState<string>(currentData.backgroundColor);
  const [linkBackgroundcolor, setLinkBackgroundcolor] = useState<string>(currentData.defaultBackgroundColorForLinks);

  useEffect(() => {
    setCurrentData({
      ...currentData,
      backgroundColor: color,
      defaultBackgroundColorForLinks: linkBackgroundcolor,
    });
  }, [color, linkBackgroundcolor]);

  return (
    <div className="flex h-full w-[500px] max-w-full flex-col gap-6 rounded-3xl border border-[#9193b3]/20 bg-[#181726] p-4">
      <div className="flex flex-col gap-1">
        <div className="text-lg">Customize</div>
        <div className="text-sm opacity-70">
          Make your page look just the way you want it to.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-base font-medium">Style</div>

        <div className="flex h-[100px] gap-4 text-xs">
          <div className="w-full opacity-50">
            <StyleOptView
              name="List"
              icon={Rows3}
              disabled={true}
              isSelected={currentData.style == "list"}
              action={() => setCurrentData({ ...currentData, style: "list" })}
            />
          </div>
          <StyleOptView
            name="Grid"
            icon={LayoutPanelTop}
            isSelected={currentData.style == "grid"}
            action={() => setCurrentData({ ...currentData, style: "grid" })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-base font-medium">Background Color</div>
        <div className="flex flex-wrap gap-2">
          <ColorButton
            currentColor={color}
            thisColor="#110e21"
            setColor={setColor}
          />
          <ColorButton
            currentColor={color}
            thisColor="#D97FB0"
            setColor={setColor}
          />
          <CustomColorButton
            currentColor={color}
            thisColor="#D97FB0"
            setColor={setColor}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-base font-medium">Background Color for Links</div>
        <div className="flex flex-wrap gap-2">
          <ColorButton
            currentColor={linkBackgroundcolor}
            thisColor="#181724"
            setColor={setLinkBackgroundcolor}
          />
          <ColorButton
            currentColor={linkBackgroundcolor}
            thisColor="#D97FB0"
            setColor={setLinkBackgroundcolor}
          />
          <CustomColorButton
            currentColor={linkBackgroundcolor}
            thisColor="#D97FB0"
            setColor={setLinkBackgroundcolor}
          />
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              currentData.useAutoLinkTinting
            }
            onChange={() => {
              setCurrentData({...currentData, useAutoLinkTinting: !currentData.useAutoLinkTinting})
            }}
            className="rounded-lg"
            style={{
              appearance: "none",
              width: "20px",
              height: "20px",
              backgroundColor: currentData.useAutoLinkTinting
                ? "#D97FB0"
                : "transparent",
              border: "2px solid #D97FB0",
              transition: "background-color 0.3s ease",
            }}
          />
          <span
            style={{
              color: currentData.useAutoLinkTinting
                ? "#D97FB0"
                : "#c4c5ea",
            }}
          >
            Use Auto Link Tinting
          </span>
        </label>
      </div>
    </div>
  );
}

function ColorButton({
  currentColor,
  setColor,
  thisColor,
}: {
  thisColor: string;
  currentColor: string;
  setColor: Dispatch<SetStateAction<string>>;
}) {
  const mainStyles: CSSProperties = {
    background:
      currentColor == thisColor ? "rgb(196 197 234 / 0.5)" : thisColor,
    width: 35,
    padding: currentColor == thisColor ? "4px" : "0px",
    aspectRatio: 1 / 1,
    boxShadow: "0px 4px 10px rgb(196 197 234 / 0.1)", // Add shadow here
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-full"
      style={mainStyles}
      onClick={() => setColor(thisColor)}
    >
      <div
        style={{
          backgroundColor: thisColor,
        }}
        className="h-full w-full rounded-full outline outline-2 outline-[#181726]"
      ></div>
    </div>
  );
}

function CustomColorButton({
  currentColor,
  setColor,
  thisColor,
}: {
  thisColor: string;
  currentColor: string;
  setColor: Dispatch<SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sSelectedCSS: CSSProperties = {
    backgroundColor: currentColor,
  };

  const mainStyles: CSSProperties = {
    background:
      "conic-gradient(from 0deg, rgba(255, 0, 0, 0.8), rgba(255, 255, 0, 0.8), rgba(0, 255, 0, 0.8), rgba(0, 255, 255, 0.8), rgba(0, 0, 255, 0.8), rgba(255, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
    width: 35,
    padding: "4px",
    aspectRatio: 1 / 1,
  };

  return (
    <Popover onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger>
        <div
          className="cursor-pointer overflow-hidden rounded-full"
          style={mainStyles}
        >
          <div
            style={sSelectedCSS}
            className="flex h-full w-full items-center justify-center rounded-full outline outline-2 outline-[#181726]"
          >
            <ChevronDown
              size={18}
              style={{ rotate: isOpen ? "180deg" : "0deg", color: "#c4c5ea" }}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent //removing all the default styles (basically)
        className="hw-fit mt-2 flex justify-center border-none p-0 outline-none"
        style={{ backgroundColor: "transparent" }}
      >
        <ColorPicker color={currentColor} setColor={setColor} />
      </PopoverContent>
    </Popover>
  );
}

const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background:
      "conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)",
    cursor: "pointer",
    outline: "none",
  },
  icon: {
    fontSize: "18px",
    color: "white",
  },
};

interface StyleOptViewProps {
  name: string;
  isSelected: boolean;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  action: () => void;
  disabled?: boolean;
}

function ColorPicker({
  color,
  setColor,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex w-fit flex-col gap-2 rounded-xl bg-[#181726] p-2 outline outline-[#9193b3]/20">
      <HexColorPicker color={color} onChange={setColor} />

      <div className="flex w-[200px] rounded-xl bg-[#9193b3]/20 text-[#c4c5ea]">
        <div
          className="ms-1 flex items-center justify-center text-sm"
          style={{ height: "100%", width: "20px" }}
        >
          #
        </div>
        <HexColorInput
          placeholder="Hex Code"
          className="m-1 w-full rounded-lg bg-[#181726] p-1 ps-2 text-sm focus:outline-none"
          color={color}
          onChange={setColor}
        />
      </div>
    </div>
  );
}

function StyleOptView({
  name,
  isSelected,
  icon: Icon,
  disabled,
  action,
}: StyleOptViewProps) {
  return (
    <button
      className={`flex h-full w-full flex-col justify-between rounded-3xl bg-[#181726] p-4 outline outline-[#181726]`}
      disabled={disabled}
      style={{
        outlineColor: isSelected
          ? "rgb(217 127 176 / 1)"
          : "rgb(145 147 179 / 0.4)",
      }}
      onClick={action}
    >
      <Icon
        fill={isSelected ? "rgb(217 127 176 / 0.2)" : undefined}
        className="h-10"
        color={isSelected ? "#D97FB0" : "#9193B3"}
      />
      <div>{name}</div>
    </button>
  );
}
