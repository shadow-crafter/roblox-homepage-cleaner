function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        removeHighlights: document.querySelector("#remove-highlights").checked,
        removeRecommended: document.querySelector("#remove-recommended").checked
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#remove-highlights").checked = result.removeHighlights;
        document.querySelector("#remove-recommended").checked = result.removeRecommended;
    }

    function onError(error) {
        console.error(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get({"removeHighlights": true, "removeRecommended": true});
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
