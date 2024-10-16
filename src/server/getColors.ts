export interface ImgeColorOptions {
  url: string;
  excludeBlackAndWhite?: boolean;
  numOfColors?: number;
  notToDark?: boolean;
  notToBright?: boolean;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // This allows you to pull images from third-party sources
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

// Function to get the 3 most dominant colors
const getDominantColors = async (
  options: ImgeColorOptions,
): Promise<string[]> => {
  //getting the values and putting in default ones

  const img = await loadImage(options.url);

  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  // Set canvas size to the size of the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get pixel data from the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Create a map to store the color frequencies
  const colorMap: { [color: string]: number } = {};

  // Loop through pixel data (each pixel has 4 values: R, G, B, A)
  for (let i = 0; i < imageData.length; i += 4) {
    // Get RGB values
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];

    // Ignore fully transparent pixels
    if (a === 0) continue;

    if (options.notToDark) {
      // Check if the color is too close to gray or black
      const calculatedBrightness =
        ((r ?? 0) * 299 + (g ?? 0) * 587 + (b ?? 0) * 114) / 1000 ?? 0;
      const brightness = calculatedBrightness;
      const saturation =
        Math.max(r ?? 0, g ?? 0, b ?? 0) - Math.min(r ?? 0, g ?? 0, b ?? 0);
      if (brightness < 50 || saturation < 30) {
        continue;
      }
    }

    if (options.notToBright) {
      //Not done yet
      // Check if the color is too close to gray or black
      const calculatedBrightness =
        ((r ?? 0) * 299 + (g ?? 0) * 587 + (b ?? 0) * 114) / 1000 ?? 0;
      const brightness = calculatedBrightness;
      const saturation =
        Math.max(r ?? 0, g ?? 0, b ?? 0) - Math.min(r ?? 0, g ?? 0, b ?? 0);
      if (brightness < 50 || saturation < 30) {
        continue;
      }
    }

    // Exclude black and white colors if specified
    if (options.excludeBlackAndWhite) {
      if (
        (r === 0 && g === 0 && b === 0) ||
        (r === 255 && g === 255 && b === 255)
      ) {
        continue;
      }
    }

    // Convert RGB to hex
    const hex = rgbToHex(r, g, b);

    // Update frequency count of the color
    colorMap[hex] = (colorMap[hex] || 0) + 1;
  }

  // Sort colors by frequency and return the top 3 most frequent colors
  const dominantColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, options.numOfColors ?? 3)
    .map(([color]) => color);

  return dominantColors;
};

// Utility function to convert RGB to Hex
const rgbToHex = (
  r: number | undefined,
  g: number | undefined,
  b: number | undefined,
): string => {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  if (r === undefined || g === undefined || b === undefined) {
    return "#000000"; // Return black if any of the RGB values are undefined
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default getDominantColors;
