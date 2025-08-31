const runtimeAPI =
  typeof browser !== "undefined" ? browser.runtime : chrome.runtime;

const highlightTitleClass = ".css-1h1fine-titleSubtitleContainer";
const gameSectionsClass = ".game-sort-carousel-wrapper";
const friendsSectionClass = ".friend-carousel-container";
const gameCarouselClass = ".game-carousel";
const gamePillsClass = ".game-card-pills-container";
const gameTitleClass = ".game-card-name";
const gameInfoLabelClass = ".info-label";
const thumbnailContainerClass = ".thumbnail-2d-container";
const reccomendedSectionsId = '[data-testid="home-page-game-grid"]';

const settings = {
  removeHighlights: false,
  removeRecommended: false,
  removeContinue: false,
  removeFavorites: false,
  removeFriends: false,
  showPinned: false,
  pinnedGames: [],
};

let pinnedSectionCreated = false;

function removeSection(section, titleText = "") {
  if (section.getAttribute("id") == "pinned-section") {
    return;
  }
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
    if (!setting.includes("remove")) {
      continue;
    }
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
  //needs refactoring, but they need to be separate because of dom ordering
  for (const element of parent.querySelectorAll("div")) {
    for (const replaceText in replaceMap) {
      if (element.ariaLabel && element.ariaLabel.includes(replaceText)) {
        element.ariaLabel = replaceMap[replaceText];
      }
    }
  }
  for (const element of parent.querySelectorAll("span")) {
    for (const replaceText in replaceMap) {
      if (element.textContent && element.textContent.includes(replaceText)) {
        element.textContent = replaceMap[replaceText];
      }
    }
  }
}

async function createPinnedSection() {
  const gameSections = document.querySelectorAll(gameSectionsClass);
  let highlightsSection;
  for (const section of gameSections) {
    const titleElement = section.querySelector(highlightTitleClass);
    if (titleElement && titleElement.ariaLabel.includes("Today's Picks")) {
      highlightsSection = section;
      break;
    }
  }

  if (highlightsSection && !pinnedSectionCreated) {
    pinnedSectionCreated = true;

    const pinnedSection = highlightsSection.cloneNode(true);
    highlightsSection.parentElement.prepend(pinnedSection);
    pinnedSection.style.display = "table";
    pinnedSection.setAttribute("id", "pinned-section");
    const titleElement = pinnedSection.querySelector(highlightTitleClass);

    const replaceMap = {
      "Today's Picks": "Pinned Games",
      "A curated selection of daily highlights":
        "Check extension to alter the pinned games!",
    };
    replaceLabels(titleElement, replaceMap);

    const gameCarousel = pinnedSection.querySelector(gameCarouselClass);
    let gameBase;
    for (const gameElement of gameCarousel.querySelectorAll("li")) {
      gameBase = gameElement.cloneNode(true);
      gameElement.remove();
    }

    const pinnedPlaceIds = settings.pinnedGames;

    for (const placeId of pinnedPlaceIds) {
      gameInfo = await getGameInfo(placeId);
      if (gameInfo) {
        const gameElement = gameBase.cloneNode(true);
        gameCarousel.appendChild(gameElement);

        gameElement.id = gameInfo.gameData.placeId;
        gameElement.querySelector("a").href = gameInfo.gameData.url;
        gameElement.querySelector(gameTitleClass).title =
          gameInfo.gameData.name;
        gameElement.querySelector(gameTitleClass).innerHTML =
          gameInfo.gameData.name;

        const gameThumbnail = gameElement.querySelector("img");
        if (gameThumbnail) {
          gameThumbnail.src = gameInfo.thumbnailData.imageUrl;
          gameThumbnail.alt = gameInfo.gameData.name;
          gameThumbnail.title = gameInfo.gameData.name;
        } else {
          //depending on loading time, sometimes image isn't created
          const thumbnailContainer = gameElement.querySelector(
            thumbnailContainerClass
          );
          if (thumbnailContainer) {
            const newThumbnail = document.createElement("img");
            thumbnailContainer.appendChild(newThumbnail);
            newThumbnail.src = gameInfo.thumbnailData.imageUrl;
            newThumbnail.alt = gameInfo.gameData.name;
            newThumbnail.title = gameInfo.gameData.name;
          }
        }

        const gameInfoLabel = gameElement.querySelector(gameInfoLabelClass);
        if (gameInfoLabel) {
          gameInfoLabel.textContent = `By ${gameInfo.gameData.builder}`;
        }

        const pillContainer = gameElement.querySelector(gamePillsClass); //remove "event" notice if its there
        if (pillContainer) {
          pillContainer.remove();
        }

        const scroller =
          gameElement.parentElement.parentElement.parentElement.querySelector(
            ".scroller-new"
          ); //janky remove scroller
        if (scroller) {
          scroller.remove();
        }
      }
    }
  }
}

function init() {
  let sections = {
    gameSections: document.querySelectorAll(gameSectionsClass),
    recommendedSections: document.querySelectorAll(reccomendedSectionsId),
    friendSection: document.querySelectorAll(friendsSectionClass),
  };

  updateSections(sections);
  if (settings.showPinned && !pinnedSectionCreated) {
    createPinnedSection();
  }
}

const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });

runtimeAPI
  .sendMessage({ action: "getOptions" })
  .then(applyOptions)
  .catch((error) => {
    console.error("Error sending message to background script => ", error);
  });
