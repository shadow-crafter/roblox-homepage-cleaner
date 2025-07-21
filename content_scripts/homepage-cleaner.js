const highlightTitleClass = '.css-1h1fine-titleSubtitleContainer';

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
        firstSections.forEach(section => {
            removeSection(section, true, "Today's Picks");
        });
    }
    if (removeRecommended) {
        recommendedSections.forEach(section => {
            removeSection(section);
        });
    }
}

function updateSettings(settings) {
    removeHighlights = settings.removeHighlights;
    removeRecommended = settings.removeRecommended;
    init();
}

function init() {
    let firstSections = document.querySelectorAll('.game-sort-carousel-wrapper');
    let recommendedSections = document.querySelectorAll('[data-testid="home-page-game-grid"]');

    updateSections(firstSections, recommendedSections);
    console.log("Homepage sections updated");
}

const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });

browser.storage.sync.get(["removeHighlights", "removeRecommended"]).then(updateSettings);
