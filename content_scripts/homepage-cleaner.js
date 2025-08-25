const runtimeAPI =
  typeof browser !== "undefined" ? browser.runtime : chrome.runtime;

const highlightTitleClass = ".css-1h1fine-titleSubtitleContainer";
const firstSectionsClass = ".game-sort-carousel-wrapper";
const friendsSectionClass = ".friend-carousel-container";
const reccomendedSectionsId = '[data-testid="home-page-game-grid"]';

let removeHighlights = false;
let removeRecommended = false;
let removeContinue = false;

function removeSection(section, titleText = "") {
  if (titleText !== "") {
    const titleElement = section.querySelector(highlightTitleClass);
    if (titleElement && titleElement.ariaLabel.includes(titleText)) {
      section.style.display = "none";
    }
  } else {
    section.style.display = "none";
  }
}

function updateSections(firstSections, recommendedSections) {
  if (!removeHighlights && !removeRecommended && !removeContinue) return;
  if (removeHighlights) {
    firstSections.forEach((section) => {
      removeSection(section, "Today's Picks");
    });
  }
  if (removeContinue) {
    firstSections.forEach((section) => {
      removeSection(section, "Continue");
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
