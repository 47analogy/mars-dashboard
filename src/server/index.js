require('dotenv').config();
const express = require('express');
//const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls

// example API call
app.get('/apod', async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    console.log(image);
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/*
{
  date: '2021-01-17',
  explanation: 'The jets emanating from Centaurus A are over a million light years long. These jets of streaming plasma, expelled by a giant black hole in the center of this spiral galaxy,  light up this composite image of Cen A. Exactly how the central black hole expels infalling matter remains unknown. After clearing the galaxy, however, the jets inflate large radio bubbles that likely glow for millions of years. If energized by a passing gas cloud, the radio bubbles can even light up again after billions of years. X-ray light is depicted in the featured composite image in blue, while microwave light is colored orange.  The base of the jet in radio light shows details of the innermost light year of the central jet.',
  hdurl: 'https://apod.nasa.gov/apod/image/2101/CenAjets_EsoNasa_1280.jpg',
  media_type: 'image',
  service_version: 'v1',
  title: 'Jets from Unusual Galaxy Centaurus A',
  url: 'https://apod.nasa.gov/apod/image/2101/CenAjets_EsoNasa_960.jpg'
}
*/
