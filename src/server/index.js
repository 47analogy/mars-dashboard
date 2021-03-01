require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// Curiosity Rover
app.get('/curiosity', async (req, res) => {
  let mostRecentSol;

  try {
    const manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    mostRecentSol = manifest.photo_manifest.max_sol;
    console.log('max_sol', manifest.photo_manifest.max_sol);

    // use sol to get images
    const { photos } = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${mostRecentSol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(photos);
  } catch (err) {
    console.log('error:', err);
  }
});

// Opportunity rover
app.get('/opportunity', async (req, res) => {
  let mostRecentSol;

  try {
    const manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity/?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());

    mostRecentSol = manifest.photo_manifest.max_sol;

    const { photos } = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${mostRecentSol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());

    res.send(photos);
  } catch (err) {
    console.log('error:', err);
  }
});

// Spirit rover
app.get('/spirit', async (req, res) => {
  let mostRecentSol;

  try {
    const manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/spirit/?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());

    mostRecentSol = manifest.photo_manifest.max_sol;

    const { photos } = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${mostRecentSol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());

    res.send(photos);
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
