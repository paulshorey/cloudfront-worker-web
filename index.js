import { cconsoleInit } from "@ps/cconsole";
import requestText from "./src/lib/requestResponse/fetch/text.js";
import { Router } from "itty-router";

const development = true;

//
// Cloud logging
//
import logdna from "@logdna/logger";
let dnaOptions = {
  app: "nlpbe-node-api",
  source: development ? "development" : "production",
  level: "debug",
};
let dnaConsole = logdna.createLogger("42ce61a790ba92d5c1661e4ad3affb83", dnaOptions);
const cconsole = cconsoleInit({
  useTrace: true,
  useColor: true,
  logToCloud: {
    log: function (str) {
      console.log("LOG to cloud", str);
      dnaConsole.log(str);
    },
    info: function (str) {
      console.log("INFO to cloud", str);
      dnaConsole.log(str, { level: "info" });
    },
    warn: function (str) {
      console.log("WARN to cloud", str);
      dnaConsole.log(str, { level: "warn" });
    },
    error: function (str) {
      // airbrake.notify(str);
      console.log("ERROR to cloud", str);
      dnaConsole.log(str, { level: "error" });
    },
  },
});

const router = Router();

const api_endpoints = [];

api_endpoints.push({
  path: "/",
  method: "get",
  response: () => {
    return new Response("Hello, world! This is a response from a CloudFlare worker.");
  },
});

api_endpoints.push({
  path: "/fetch-text",
  method: "get",
  response: (request) => {
    return requestText(request);
  },
});

api_endpoints.push({
  path: "*",
  method: "all",
  response: () => new Response("404, not found!", { status: 404 }),
});

/*
 * Handle each API endpoint
 */
for (let endpoint of api_endpoints) {
  const { path, method, auth = [], response } = endpoint;
  router[method](path, (request) => {
    // dnaConsole.log(`${method.toUpperCase()} ${path}`, { level: "info" });
    // console.log("dnaConsole", dnaConsole);
    console.log(`${method.toUpperCase()} ${path}`);
    console.info(`${method.toUpperCase()} ${path}`);
    cconsole.info(`${method.toUpperCase()} ${path}`, request.query, request.body);
    return response(request);
  });
}

addEventListener("fetch", (e) => {
  e.respondWith(router.handle(e.request));
});
