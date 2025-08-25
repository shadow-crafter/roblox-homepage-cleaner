const runtimeAPI =
  typeof browser !== "undefined" ? browser.runtime : chrome.runtime;

const highlightTitleClass = ".css-1h1fine-titleSubtitleContainer";
const gameSectionsClass = ".game-sort-carousel-wrapper";
const friendsSectionClass = ".friend-carousel-container";
const reccomendedSectionsId = '[data-testid="home-page-game-grid"]';

const settings = {
  removeHighlights: false,
  removeRecommended: false,
  removeContinue: false,
  removeFavorites: false,
  removeFriends: false,
};

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

function updateSections(sections) {
  const removalMap = {
    removeHighlights: {
      section: sections.gameSections,
      titleText: "Today's Picks",
    },
    removeContinue: {
      section: sections.gameSections,
      titleText: "Continue",
    },
    removeFavorites: {
      section: sections.gameSections,
      titleText: "Favorites",
    },
    removeRecommended: {
      section: sections.recommendedSections,
      titleText: "",
    },
    removeFriends: {
      section: sections.friendSection,
      titleText: "",
    },
  };

  for (const setting in settings) {
    const mapInfo = removalMap[setting];
    if (mapInfo && settings[setting] == true) {
      mapInfo.section.forEach((section) => {
        removeSection(section, mapInfo.titleText);
      });
    }
  }
}

async function applyOptions(responce) {
  console.log("Got responce from background! => ", responce);
  if (responce === undefined || responce.result === undefined) {
    console.error("Failed to get options from responce.");
  }
  options = responce.result;

  settings.removeHighlights = options.removeHighlights;
  settings.removeRecommended = options.removeRecommended;
  settings.removeContinue = options.removeContinue;
  settings.removeFavorites = options.removeFavorites;
  settings.removeFriends = options.removeFriends;
  init();
}

function init() {
  let sections = {
    gameSections: document.querySelectorAll(gameSectionsClass),
    recommendedSections: document.querySelectorAll(reccomendedSectionsId),
    friendSection: document.querySelectorAll(friendsSectionClass),
  };

  updateSections(sections);
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
