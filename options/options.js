async function saveOptions(e) {
  e.preventDefault();

  const options = {
    removeHighlights: document.querySelector("#remove-highlights").checked,
    removeRecommended: document.querySelector("#remove-recommended").checked,
    removeContinue: document.querySelector("#remove-continue").checked,
    removeFavorites: document.querySelector("#remove-favorites").checked,
    removeFriends: document.querySelector("#remove-friends").checked,
  };

  await self.storageUtils.saveOptions(options);
}

async function restoreOptions() {
  const options = await self.storageUtils.getOptions();

  document.querySelector("#remove-highlights").checked =
    options.removeHighlights;
  document.querySelector("#remove-recommended").checked =
    options.removeRecommended;
  document.querySelector("#remove-continue").checked = options.removeContinue;
  document.querySelector("#remove-favorites").checked = options.removeFavorites;
  document.querySelector("#remove-friends").checked = options.removeFriends;

  console.log("Options have been restored!");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
