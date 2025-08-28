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
  } else {
    options = responce.result;

    Object.assign(settings, options);

    init();
  }
}

async function getGameInfo(placeId) {
  let gameInfo;
  const responce = await runtimeAPI.sendMessage({
    action: "getGameInfo",
    placeId: placeId,
  });

  if (responce === undefined || responce.result === undefined) {
    console.error("Failed to get options from responce.");
  } else {
    gameInfo = responce.result;
  }
  console.log(`Game info for ${placeId}: ${gameInfo}`);
  return gameInfo;
}

function replaceLabels(parent, replaceMap) {
  for (const element of parent.querySelectorAll("*")) {
    for (const replaceText in replaceMap) {
      if (element.ariaLabel && element.ariaLabel.includes(replaceText)) {
        element.ariaLabel = replaceMap[replaceText];
      }
      if (element.innerHTML && element.innerHTML.includes(replaceText)) {
        element.innerHTML = replaceMap[replaceText];
      }
    }
    replaceLabels(element, replaceMap); //should die out when no elements are left
  }
}

function createPinnedSection() {
  const gameSections = document.querySelectorAll(gameSectionsClass);
  let highlightsSection;
  for (const section of gameSections) {
    const titleElement = section.querySelector(highlightTitleClass);
    if (titleElement && titleElement.ariaLabel.includes("Today's Picks")) {
      highlightsSection = section;
      break;
    }
  }

  if (highlightsSection) {
    const pinnedSection = highlightsSection.cloneNode(true);
    highlightsSection.parentElement.prepend(pinnedSection);
    pinnedSection.style.display = "table";
    const titleElement = pinnedSection.querySelector(highlightTitleClass);

    const replaceMap = {
      "Today's Picks": "Pinned Games",
      "A curated selection of daily highlights":
        "Check extension to alter the pinned games!",
    };
    replaceLabels(titleElement, replaceMap);
    console.log(pinnedSection);
  } else {
    console.error("Could not find a highlights section to create pinned");
  }
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

createPinnedSection();
