"use server";
import puppeteer from "puppeteer";
import { utapi } from "./uploadthing";
import { getHtmlString } from "./convertToHtml";
import { GridPageProps } from "~/app/edit/test/2/page";
import GridPage from "~/app/edit/test/2/page";
import { createElement } from "react";
import { env } from "process";

// Function to capture screenshot from HTML using Puppeteer
async function captureScreenshotFromHtml(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load the HTML into a new page
  await page.setContent(html, { waitUntil: "networkidle2" });

  // Take a screenshot
  const screenshotBuffer = await page.screenshot();
  await browser.close();
  return screenshotBuffer as Buffer;
}

async function captureScreenshot(url: string, width: number = 1042, height: number = 900): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport size
  await page.setViewport({ width, height });

  await page.goto(url, { waitUntil: "networkidle2" });
  
  await new Promise(resolve => setTimeout(resolve, 5000))

  const screenshotBuffer = await page.screenshot();
  await browser.close();
  
  return screenshotBuffer as Buffer;
}

async function uploadToUploadThing(buffer: Buffer): Promise<string | null> {
  const file = new File([buffer], "screenshot.png", { type: "image/png" });
  const response = await utapi.uploadFiles([file]);
  return response[0]?.data?.url ?? null;
}

export async function captureGridAndUpload(
  url: string
): Promise<string | null> {
  try {
    const fullURL = "https://linkifyit.vercel.app" + url;
    const screenshotBuffer = await captureScreenshot(fullURL);
    const uploadUrl = await uploadToUploadThing(screenshotBuffer);
    return uploadUrl;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to capture or upload the screenshot.");
  }
}
