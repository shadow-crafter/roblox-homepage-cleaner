const firstSections = document.querySelectorAll('.game-sort-carousel-wrapper');
const recomendedSections = document.querySelectorAll('[data-testid="home-page-game-grid"]');

document.body.style.border = "5px solid green"; // Just to confirm the script is running

function updateSections() {
    firstSections.forEach(section => {
        const titleElement = section.querySelector(".css-1h1fine-titleSubtitleContainer");
        console.log(titleElement + "  removed!");
        if (titleElement && titleElement.ariaLabel.includes("Today's Picks")) {
            section.style.display = "none";
        }
    });
    recomendedSections.forEach(section => {
        section.style.display = "none";
        console.log(section + "  removed!");
    });
}

updateSections();
