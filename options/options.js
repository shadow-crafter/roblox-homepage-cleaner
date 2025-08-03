async function saveOptions(e) {
  e.preventDefault();

  const options = {
    removeHighlights: document.querySelector("#remove-highlights").checked,
    removeRecommended: document.querySelector("#remove-recommended").checked,
  };

  await window.storageUtils.saveOptions(options);
}

async function restoreOptions() {
  const options = await window.storageUtils.getOptions();

  document.querySelector("#remove-highlights").checked =
    options.removeHighlights;
  document.querySelector("#remove-recommended").checked =
    options.removeRecommended;

  console.log("Options have been restored!");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
