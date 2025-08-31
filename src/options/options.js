const optionIds = [
  "remove-highlights",
  "remove-recommended",
  "remove-continue",
  "remove-favorites",
  "remove-friends",
  "show-pinned",
];

//helper function to convert string into camel case. This is needed to maintain the original formatting
const toCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

function getPlaceIDS() {
  const placeIdInputContainer = document.getElementById("pinned-games");
  const placeIds = [];

  for (const input of placeIdInputContainer.children) {
    if (input.tagName === "INPUT") {
      placeIds.push(input.value);
    }
  }

  return placeIds;
}

async function saveOptions(e) {
  e.preventDefault();

  //create options object based on the ids
  const options = optionIds.reduce((obj, id) => {
    const camelCaseId = toCamelCase(id); //retain formatting
    obj[camelCaseId] = document.querySelector(`#${id}`).checked;
    return obj;
  }, {});

  placeIds = getPlaceIDS();
  options["pinnedGames"] = placeIds;

  console.log("options: ", options);

  await self.storageUtils.saveOptions(options);
}

async function restoreOptions() {
  const options = await self.storageUtils.getOptions();

  optionIds.forEach((id) => {
    document.querySelector(`#${id}`).checked = options[toCamelCase(id)];
  });

  //load placeIDS
  const placeIdInputContainer = document.getElementById("pinned-games");
  placeIds = options["pinnedGames"];
  for (const [index, input] of [...placeIdInputContainer.children].entries()) {
    if (index > placeIds.length - 1) {
      break;
    }
    if (input.tagName === "INPUT") {
      input.value = placeIds[index];
    }
  }

  console.log("Options have been restored!");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
