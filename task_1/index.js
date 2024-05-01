import { encoded, translations } from "./data.js";

function decodeEncodedData(encoded, translations) {
  const uniqueIds = {};
  const decodedData = encoded.map((obj) => {
    const decodedObj = {};
    for (const key in obj) {
      if (key.endsWith("Id") && translations[obj[key]] !== undefined) {
        decodedObj[key.slice(0, -2)] = translations[obj[key]];
        uniqueIds[obj[key]] = true;
      } else {
        decodedObj[key] = obj[key];
      }
    }
    return decodedObj;
  });
  const uniqueIdList = Object.keys(uniqueIds);
  return { decodedData, uniqueIdList };
}

const { decodedData, uniqueIdList } = decodeEncodedData(encoded, translations);

console.log("Decoded Data:");
console.log(decodedData);
console.log("\nUnique ID List:");
console.log(uniqueIdList);
