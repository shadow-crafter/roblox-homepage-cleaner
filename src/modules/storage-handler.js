self.browserAPI = typeof browser !== "undefined" ? self.browser : self.chrome;

//create a global object for shared functions
if (!self.storageUtils) {
  self.storageUtils = {};
}

self.storageUtils.getOptions = async function () {
  try {
    const defaults = {
      removeHighlights: false,
      removeRecommended: false,
      removeContinue: false,
      removeFavorites: false,
      removeFriends: false,
      showPinned: false,
      pinnedGames: [],
    };

    const options = await browserAPI.storage.sync.get(defaults);

    console.log(`Options loaded successfully! => ${options}`);
    return options;
  } catch (error) {
    console.error(`Error getting options :( => ${error}`);
    return defaults;
  }
};

self.storageUtils.saveOptions = async function (options) {
  try {
    console.log("trying to save..");
    await browserAPI.storage.sync.set(options);
    console.log(`Options saved successfully! => ${options}`);
  } catch (error) {
    console.error(`Error saving options :( => ${error}`);
  }
};
