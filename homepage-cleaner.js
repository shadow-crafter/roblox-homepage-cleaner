const highlightTitleClass = '.css-1h1fine-titleSubtitleContainer';

document.body.style.border = "5px solid green"; // Just to confirm the script is running

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
    firstSections.forEach(section => {
        removeSection(section, true, "Today's Picks");
    });
    recomendedSections.forEach(section => {
        removeSection(section);
    });
}

const observer = new MutationObserver((mutationsList, _) => {
    let firstSections = document.querySelectorAll('.game-sort-carousel-wrapper');
    let recomendedSections = document.querySelectorAll('[data-testid="home-page-game-grid"]');

    updateSections(firstSections, recomendedSections);
    console.log("Homepage sections updated");
});

observer.observe(document.body, { childList: true, subtree: true });
