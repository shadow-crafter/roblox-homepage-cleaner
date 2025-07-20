const recomendedSection = document.querySelectorAll(".game-sort-carousel-wrapper");

document.body.style.border = "5px solid green";

function updateSections() {
    recomendedSection.forEach(section => {
        const titleElement = section.querySelector(".css-1h1fine-titleSubtitleContainer");
        console.log(titleElement + "  !!aaa");
        if (titleElement && titleElement.ariaLabel.includes("Today's Picks")) {
            section.style.display = "none";
        }
    });
}

updateSections();
