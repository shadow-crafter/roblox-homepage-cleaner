const gameInfoUrl =
  "https://games.roblox.com/v1/games/multiget-place-details?placeIds={0}"; //gets game info from place ID
const universeThumbnailUrl =
  "https://thumbnails.roblox.com/v1/games/icons?universeIds={0}&size=256x256&format=Webp&isCircular=false"; //gets game thumbnail from universe ID

//format function code from https://www.geeksforgeeks.org/javascript/javascript-string-formatting/
function format(str, ...values) {
  return str.replace(/{(\d+)}/g, function (match, index) {
    return typeof values[index] !== "undefined" ? values[index] : match;
  });
}

async function fetchData(url, id) {
  try {
    const response = await fetch(format(url, id));

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`Game data fetched: ${gameData}`);

    return data;
  } catch (error) {
    console.error(`There was a problem with the fetch operation: ${error}`);
  }
}

async function getGameData(placeId) {
  const gameData = await fetchData(gameInfoUrl, placeId);

  console.log(`Game data fetched: ${gameData}`);

  const universeId = gameData.data[0].universeId;
  const thumbnailData = await fetchData(universeThumbnailUrl, universeId);

  const gameInfo = { gameData: gameData, thumbnailData: thumbnailData };
  return gameInfo;
}
