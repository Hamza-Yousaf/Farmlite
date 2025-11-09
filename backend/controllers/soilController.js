import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
// const model = "openai/gpt-4.1";
const model = "openai/gpt-4o-mini";
// const model = "openai/gpt-5";

const API_KEY = process.env.API_KEY;

// GRABBING THE BASIC SOIL DATA
export const getSoilData = async (req, res) => {
  const { polyid } = req.params;

  try {
    const response = await fetch(
      `http://api.agromonitoring.com/agro/1.0/soil?polyid=${polyid}&appid=${API_KEY}&duplicated=true`
    );
    const data = await response.json();
    console.log(data);
    return res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// CREATING THE POLYGON
export const createPolygon = async (req, res) => {
  try {
    const { coordinates } = req.body;

    // Close the polygon (repeat first coordinate at the end)
    // const closedCoords = [...coordinates, coordinates[0]];

    const properCoords = coordinates.map(([lat, lon]) => [lon, lat]);

    // Close the polygon by repeating the first coordinate
    if (
      properCoords[0][0] !== properCoords[properCoords.length - 1][0] ||
      properCoords[0][1] !== properCoords[properCoords.length - 1][1]
    ) {
      properCoords.push(properCoords[0]);
    }

    const payload = {
      name: "User Polygon fixed",
      geo_json: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [properCoords],
        },
      },
    };

    const response = await fetch(
      `https://api.agromonitoring.com/agro/1.0/polygons?appid=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Polygon creation failed:", data);
      return res
        .status(500)
        .json({ error: "Failed to create polygon", details: data });
    }

    // send back the polygon id to the frontend
    res.json({
      polyid: data.id,
      center: data.center,
      area: data.area,
    });
  } catch (err) {
    console.error("Error creating polygon:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GETTING THE POLYGON DATA (MORE SPICIFIC + HISTORICAL)
export const getPolygonData = async (req, res) => {
  const now = Math.floor(Date.now() / 1000) - 60 * 5; // 5 minutes ago
  const sixMonthsAgo = now - 60 * 60 * 24 * 30 * 1;

  const { polyid } = req.params;

  console.log({ start: sixMonthsAgo, end: now }, polyid);

  try {
    const response = await fetch(
      `https://api.agromonitoring.com/agro/1.0/ndvi/history?start=${sixMonthsAgo}&end=${now}&polyid=${polyid}&appid=${API_KEY}`
    );
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Error fetching polygon data:", err);
    throw err;
  }
};

export const gpt_response = async (req, res) => {
  return res.status(200).json({ summary: "twoSentenceSummary" });
};

// export const gpt_response = async (req, res) => {
//   try {
//     const now = Math.floor(Date.now() / 1000) - 60 * 5; // 5 minutes ago
//     const sixMonthsAgo = now - 60 * 60 * 24 * 30 * 1;

//     const { polyid } = req.params;

//     console.log({ start: sixMonthsAgo, end: now }, polyid);
//     let data = [];
//     let data2 = [];
//     try {
//       const response = await fetch(
//         `https://api.agromonitoring.com/agro/1.0/ndvi/history?start=${sixMonthsAgo}&end=${now}&polyid=${polyid}&appid=${API_KEY}`
//       );
//       data = await response.json();
//     } catch (err) {
//       console.error("Error fetching polygon data:", err);
//       throw err;
//     }

//     try {
//       const response = await fetch(
//         `http://api.agromonitoring.com/agro/1.0/soil?polyid=${polyid}&appid=${API_KEY}&duplicated=true`
//       );
//       data2 = await response.json();
//     } catch (error) {
//       res.status(500).json({ error: "Server error" });
//     }

//     // --- Prepare combined data text ---
//     const combinedText = `
// NDVI HISTORY:
// ${JSON.stringify(data)}

// SOIL DATA:
// ${JSON.stringify(data2)}
//     `;

//     // --- Chunk the data (to avoid token overflow) ---
//     const CHUNK_SIZE = 4000; // characters
//     const chunks = [];
//     for (let i = 0; i < combinedText.length; i += CHUNK_SIZE) {
//       chunks.push(combinedText.slice(i, i + CHUNK_SIZE));
//     }

//     // --- Initialize Azure model client ---
//     const client = ModelClient(endpoint, new AzureKeyCredential(token));

//     // --- Combine both datasets into one structured prompt ---
//     const combinedPrompt = `
// You are an expert environmental analyst.
// You will be given two related datasets about a piece of farmland: one for vegetation (NDVI history) and one for soil (moisture, temperature).

// Your job:
// 1. Carefully analyze both datasets together.
// 2. Write exactly **2 clear sentences** describing the overall condition of the land and vegetation.
// 3. Focus on **soil health**, **vegetation state**, and **suitability for planting crops**.
// 4. Avoid repeating data values, numbers, or JSON — summarize insights only.

// Here is the data:

// --- NDVI Historical Data ---
// ${JSON.stringify(data, null, 2)}

// --- Soil Data ---
// ${JSON.stringify(data2, null, 2)}
// `;

//     const response = await client.path("/chat/completions").post({
//       body: {
//         messages: [
//           {
//             role: "system",
//             content: "You are a concise environmental summarizer.",
//           },
//           { role: "user", content: combinedPrompt },
//         ],
//         model,
//       },
//     });

//     if (isUnexpected(response)) throw response.body.error;

//     const twoSentenceSummary =
//       response.body.choices?.[0]?.message?.content?.trim() ||
//       "No summary generated.";
//     // console.log(data);
//     // console.log(data2);
//     console.log(twoSentenceSummary);

//     return res.status(200).json({ summary: twoSentenceSummary });
//   } catch (err) {
//     console.error("summarizeData error:", err);
//     return res.status(500).json({ error: err.message || String(err) });
//   }
// };

//
