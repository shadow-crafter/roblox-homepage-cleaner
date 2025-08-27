import { getGameData } from "../modules/api-info-handler.js";
import "../modules/storage-handler.js";

const browserAPI = typeof browser !== "undefined" ? self.browser : self.chrome;

browserAPI.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log("Got a message!!");
  if (request.action === "getOptions") {
    self.storageUtils
      .getOptions()
      .then((options) => {
        sendResponse({ result: options });
      })
      .catch((error) => {
        console.error(`Error getting options: ${error}`);
        sendResponse({ error: error.message });
      });
  } else if (request.action === "getGameData") {
    getGameData()
      .then((gameData) => {
        sendResponse({ result: gameData });
      })
      .catch((error) => {
        console.error(`Error getting options: ${error}`);
        sendResponse({ error: error.message });
      });
  }
  return true;
});
