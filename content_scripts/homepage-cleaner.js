const highlightTitleClass = '.css-1h1fine-titleSubtitleContainer';

let removeHighlights = true;
let removeReccomended = true;

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

function updateSections(firstSections, recomendedSections) {
    if (!removeHighlights && !removeReccomended) return;
    if (removeHighlights) {
        firstSections.forEach(section => {
            removeSection(section, true, "Today's Picks");
        });
    }
    if (removeReccomended) {
        recomendedSections.forEach(section => {
            removeSection(section);
        });
    }
}

function init() {
    let firstSections = document.querySelectorAll('.game-sort-carousel-wrapper');
    let recomendedSections = document.querySelectorAll('[data-testid="home-page-game-grid"]');

    updateSections(firstSections, recomendedSections);
    console.log("Homepage sections updated");
}

const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "updateCleanerSettings") {
        removeHighlights = message.removeHighlights;
        removeReccomended = message.removeReccomended;

        init();
    }
});