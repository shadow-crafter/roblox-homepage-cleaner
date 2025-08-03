const runtimeAPI =
  typeof browser !== "undefined" ? browser.runtime : chrome.runtime;

const highlightTitleClass = ".css-1h1fine-titleSubtitleContainer";
const firstSectionsClass = ".game-sort-carousel-wrapper";
const reccomendedSectionsId = '[data-testid="home-page-game-grid"]';

let removeHighlights = false;
let removeRecommended = false;

function removeSection(section, checkTitle = false, titleText = "") {
  if (checkTitle && titleText !== "") {
    const titleElement = section.querySelector(highlightTitleClass);
    if (titleElement && titleElement.ariaLabel.includes(titleText)) {
      section.style.display = "none";
    }
  } else {
    section.style.display = "none";
  }
}

function updateSections(firstSections, recommendedSections) {
  if (!removeHighlights && !removeRecommended) return;
  if (removeHighlights) {
    firstSections.forEach((section) => {
      removeSection(section, true, "Today's Picks");
    });
  }
  if (removeRecommended) {
    recommendedSections.forEach((section) => {
      removeSection(section);
    });
  }
}

async function applyOptions(responce) {
  console.log("Got responce from background! => ", responce);
  if (responce === undefined || responce.result === undefined) {
    console.error("Failed to get options from responce.");
  }
  options = responce.result;

  removeHighlights = options.removeHighlights;
  removeRecommended = options.removeRecommended;
  init();
}

function init() {
  let firstSections = document.querySelectorAll(firstSectionsClass);
  let recommendedSections = document.querySelectorAll(reccomendedSectionsId);

  updateSections(firstSections, recommendedSections);
  //console.log("Homepage sections updated");
}

const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });

runtimeAPI
  .sendMessage({ action: "getOptions" })
  .then(applyOptions)
  .catch((error) => {
    console.error("Error sending message to background script => ", error);
  });
