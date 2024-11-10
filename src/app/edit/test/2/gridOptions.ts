import { Layout } from "react-grid-layout";

export interface BreakpointsStuff {
  [P: string]: number;
}

export interface LayoutStuff {
  [P: string]: Layout[];
}

export interface MarginsStuff {
  [P: string]: [number, number]
}

export const cols: BreakpointsStuff = {
  xl: 8,
  lg: 6,
  md: 4,
  sm: 3,
  xs: 2,
  xxs: 1,
};
export const breakpoints: BreakpointsStuff = {
  xl: 1400,
  lg: 1150,
  md: 800,
  sm: 768,
  xs: 480,
  xxs: 240,
};

export const containerPaddings: MarginsStuff = {
    xl: [80, 10], //only did this one for now
    lg: [80, 10],
    md: [80, 10],
    sm: [30, 10],
    xs: [20, 0],
    xxs: [10, 0],
};