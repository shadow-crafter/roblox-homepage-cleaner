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

async function saveOptions(e) {
  e.preventDefault();

  //create options object based on the ids
  const options = optionIds.reduce((obj, id) => {
    const camelCaseId = toCamelCase(id); //retain formatting
    obj[camelCaseId] = document.querySelector(`#${id}`).checked;
    return obj;
  }, {});

  console.log("options: ", options);

  await self.storageUtils.saveOptions(options);
}

async function restoreOptions() {
  const options = await self.storageUtils.getOptions();

  optionIds.forEach((id) => {
    document.querySelector(`#${id}`).checked = options[toCamelCase(id)];
  });

  console.log("Options have been restored!");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
