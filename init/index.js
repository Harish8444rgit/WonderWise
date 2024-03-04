const initdata = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const Mongo_url =process.env.clouddb_url
main()
  .then((res) => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(Mongo_url);
}

async function fetchDataAndAddGeometry(entry) {
  try {
    const locationAndCountry = `${entry.location},${entry.country}`;
    const apiUrl = `https://api.maptiler.com/geocoding/${locationAndCountry}.json?&fuzzyMatch=true&limit=3&key=${"Your Api Key"}`;

    const response = await axios.get(apiUrl);
    const { geometry } = response.data.features[0];
    if (geometry) {
      entry.geometry = {
        type: "Point",
        coordinates: [geometry.coordinates[0], geometry.coordinates[1]],
      };

      await entry.save();
    } else {
      console.warn(
        "No matching geometry found for location and country:",
        locationAndCountry
      );
    }
  } catch (error) {
    console.error("Error fetching data or updating entry:", error);
  }
}

async function updateGeometryForAllDocuments() {
  try {
    const allDocuments = await Listing.find();
    for (const document of allDocuments) {
      await fetchDataAndAddGeometry(document);
    }
    console.log("Geometry update for all documents completed.");
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
}
// updateGeometryForAllDocuments();

const updateData= async()=>{
  const allEntries = await Listing.find();
  const updatedData = allEntries.map((entry) => entry.toObject()); // Convert Mongoose documents to plain objects

  const directoryPath = "M:\\web-dev\\Major project\\init";
  const fileName = "data.js"; // File name

  const filePath = path.join(directoryPath, fileName);

  const fileContent = `const data = ${JSON.stringify(
    updatedData,
    null,
    2
  )};\n\nmodule.exports = data;\n`;

  fs.writeFileSync(filePath, fileContent, "utf-8");

  console.log("Geometry update for all entries completed.");
}
// updateData();
const initDB = async () => {
  const allEntries = await Listing.find();
   console.log(allEntries);
   await Listing.deleteMany({});
  await Listing.insertMany(initdata)
  
};
// initDB();
