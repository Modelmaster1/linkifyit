"use server"
// Utility function to determine whether black or white is more readable based on a hex color code
const getReadableTextColor = (hex: string | undefined | null, darkColor: string = "#000000", lightColor: string = "#ffffff"): string => {
  if (hex) {
    // Remove the '#' if it's included
    const normalizedHex = hex.replace("#", "");

    // Convert the hex to RGB values
    const r = parseInt(normalizedHex.substring(0, 2), 16);
    const g = parseInt(normalizedHex.substring(2, 4), 16);
    const b = parseInt(normalizedHex.substring(4, 6), 16);

    // Calculate the YIQ value based on the RGB values
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white if YIQ is below 128, else return black
    //return yiq >= 128 ?"#ffffff" : "#000000";
    return yiq >= 128 ? darkColor : lightColor
  }

  return lightColor // it will default to the lightColor if it's not provided;
};

export default getReadableTextColor;
