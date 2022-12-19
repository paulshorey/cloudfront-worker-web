import sourceCodeText from "@ps/fn/requests/crawl_source/text";
import html from "../../../../html.js";
import contentTypes from "../../../../content-types.js";
import { basicJSONResponse, basicJSONErrorResponse } from "../../response/basic";

export default async function (request) {
  const searchParams = new URL(request.url).searchParams;

  let url = searchParams.get("url");
  if (url && !url.match(/^[a-zA-Z]+:\/\//)) url = "http://" + url;

  const selector = searchParams.get("selector");
  const attr = searchParams.get("attr");
  const spaced = searchParams.get("spaced"); // Adds spaces between tags
  const pretty = searchParams.get("pretty");

  if (!url || !selector) {
    return handleSiteRequest(request);
  }

  try {
    const data = await sourceCodeText({ url, selector, attr, spaced, pretty });
    return basicJSONResponse(data);
  } catch (error) {
    return basicJSONErrorResponse(error);
  }
}

async function handleSiteRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/" || url.pathname === "") {
    return new Response(html, {
      headers: { "content-type": contentTypes.html },
    });
  }

  return new Response("Not found", { status: 404 });
}
