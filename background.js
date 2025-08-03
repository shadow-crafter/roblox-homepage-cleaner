import "./storage-handler.js";

const browserAPI =
  typeof browser !== "undefined" ? self.browser : self.chrome;

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Got a message!!");
  if (request.action === "getOptions") {
    self.storageUtils
      .getOptions()
      .then((options) => {
        sendResponse({ result: options });
      })
      .catch((error) => {
        console.error("Error getting options: ", error);
        sendResponse({ error: error.message });
      });
    return true;
  }
});
