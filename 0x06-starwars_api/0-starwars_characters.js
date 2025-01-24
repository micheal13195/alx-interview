#!/usr/bin/node
const request = require('request');

// Extract Movie ID from command-line arguments
const movieId = process.argv[2];

if (!movieId) {
  console.error('Usage: ./0-starwars_characters.js <Movie ID>');
  process.exit(1);
}

const url = `https://swapi.dev/api/films/${movieId}/`;

// Fetch movie data
request(url, async (error, response, body) => {
  if (error) {
    console.error('Network error:', error.message);
    return;
  }

  if (response.statusCode !== 200) {
    console.error(`HTTP error: ${response.statusCode}`);
    return;
  }

  let movieData;
  try {
    movieData = JSON.parse(body);
  } catch (err) {
    console.error('Parsing error:', err.message);
    return;
  }

  const characters = movieData.characters;

  try {
    const characterNames = await Promise.all(
      characters.map((url) =>
        fetchCharacter(url).catch((err) => `Error: ${err.message}`)
      )
    );

    characterNames.forEach((name) => console.log(name));
  } catch (err) {
    console.error('Error fetching character data:', err);
  }
});

// Helper function
function fetchCharacter (url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(new Error(`Network error: ${error.message}`));
      } else if (response.statusCode !== 200) {
        reject(new Error(`HTTP error: ${response.statusCode} for ${url}`));
      } else {
        try {
          const characterData = JSON.parse(body);
          resolve(characterData.name);
        } catch (err) {
          reject(new Error(`Parsing error for ${url}: ${err.message}`));
        }
      }
    });
  });
}
