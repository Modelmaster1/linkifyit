"use server";
import axios from "axios";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import GridPage, { GridPageProps } from "~/app/edit/test/2/page";

export async function getHtmlString(props: GridPageProps) {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/render",
      props,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("response", response.data);
    return response.data
  } catch (error) {
    console.error("Error fetching rendered HTML:", error);
  }
}
