window.browserAPI =
  typeof browser !== "undefined" ? window.browser : window.chrome;

//create a global object for shared functions
if (!window.storageUtils) {
  window.storageUtils = {};
}

window.storageUtils.getOptions = async function () {
  try {
    const defaults = {
      removeHighlights: false,
      removeRecommended: false,
    };

    const options = await browserAPI.storage.sync.get(defaults);

    console.log(`Options loaded successfully! => ${options}`);
    return options;
  } catch (error) {
    console.error(`Error getting options :( => ${error}`);
    return defaults;
  }
};

window.storageUtils.saveOptions = async function (options) {
  try {
    console.log("trying to save..");
    await browserAPI.storage.sync.set(options);
    console.log(`Options saved successfully! => ${options}`);
  } catch (error) {
    console.error(`Error saving options :( => ${error}`);
  }
};
