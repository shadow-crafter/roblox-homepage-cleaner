function updateSettings() {
    const removeHighlights = document.querySelector("#remove-highlights").checked;
    const removeReccomended = document.querySelector("#remove-recommended").checked;

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
            type: "updateCleanerSettings",
            removeHighlights: removeHighlights,
            removeReccomended: removeReccomended
        });
    });
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-container").classList.add("hidden");
    document.querySelector("#error-container").classList.remove("hidden");
    console.error(`Failed to execute homepage-cleaner content script: ${error.message}`);
}

browser.tabs.executeScript({ File: "content_scripts/homepage-cleaner.js" }).then().catch(reportExecuteScriptError);
