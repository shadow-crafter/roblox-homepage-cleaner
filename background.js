browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({ url: browser.runtime.getURL("options/options.html") });
});
