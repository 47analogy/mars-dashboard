let store = Immutable.Map({
  selectedRover: '',
  roverData: [],
});

/* add markup to the page */
const root = document.getElementById('root');

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
};

/* render function */
const render = (root, state) => {
  root.innerHTML = App(state);
};

/* create page content */
const App = (state) => {
  const roverData = state.get('roverData');

  return `
      <section class="container">
        <header class="header">Mars Dashboard</header>
        <main class="rover">
          <section class="rover-buttons">${selectRover()}</section>
          <section class="rover-display">${toggleRoverDisplay(
            roverData
          )}</section>
        </main>
        <footer class="footer">Copyright 2021</footer>
      </section>
    `;
};

/* listening for load event because page should load before any JS is called */
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

/* Display buttons to select a rover
 * @returns - html markup
 */
const selectRover = () => {
  return `
  <button class="select-rover" onclick="setRover('curiosity')">Curiosity</button>
  <button class="select-rover" onclick="setRover('opportunity')">Opportunity</button>
  <button class="select-rover" onclick="setRover('spirit')">Spirit</button>
  `;
};

/* Sets rover info to get and calls logic to trigger api call
 *  @param {string} rover - name of the selected rover
 *  @returns - calls triggerRoverApi
 */
const setRover = (rover) => {
  const newState = store.set('selectedRover', rover);
  updateStore(store, newState);
  return triggerRoverApi(rover);
};

/* Triggers API call to retrieve rover data
 * @param {string} rover - name of selected rover
 * @returns - calls getRoverData
 */
const triggerRoverApi = (rover) => {
  if (rover.length > 0) {
    return getRoverData(rover);
  }
};

/* Clean-up API response to display specific data (reshape data)
 */
const transformRoverData = (rawRoverData) => {
  //const roverData = store.get('roverData');
  const cleanRoverData = rawRoverData.map((roverItem) => {
    return {
      name: roverItem.rover.name,
      image: roverItem.img_src,
      launchDate: roverItem.rover.launch_date,
      landingDate: roverItem.rover.landing_date,
      status: roverItem.rover.status,
      earthDate: roverItem.earth_date,
    };
  });
  const newState = store.set('roverData', cleanRoverData);
  updateStore(store, newState);
};

/* Toggles display of rover data
 * @param {array} roverData - rover images and data
 * @returns - function displayData() or empty string
 */
const toggleRoverDisplay = (roverData) => {
  return roverData.length > 0 ? displayRoverData(roverData) : ``;
};

/* Displays rover info and images to DOM
 * @param {array} roverData - rover images and data
 * @returns - html markup
 */
const displayRoverData = (roverData) => {
  return `<section class="rover-details">
              <article class="rover-item">
                  <p class="name">Rover Name: ${roverData[0].name}</p>
                  <p class="launch-date">Launch Date: ${convertDate(
                    roverData[0].launchDate
                  )}</p>
                  <p class="landing-date">Landing Date: ${convertDate(
                    roverData[0].landingDate
                  )}</p>
                  <p class="status">Status: ${roverData[0].status}</p>
                  <p class="image-date">Pictures Taken On: ${convertDate(
                    roverData[0].earthDate
                  )}</p>
              </article>
          </section>
          <section class="rover-images">
            <div class="rover-images-list">
            ${roverData.map(
              (roverItem) =>
                `<img class="image" src="${roverItem.image}" alt="rover image" />`
            )}
            </div>
          </section>`;
};

// ------------------------------------------------------  API CALLS
/* Data provider to get API rover data
 * @param {string} roverName - name of the rover to collect data for
 */
const getRoverData = async (roverName) => {
  try {
    const roverData = await fetch(
      `http://localhost:3000/rover/${roverName}`
    ).then((res) => res.json());
    transformRoverData(roverData);
  } catch (err) {
    console.log('error:', err);
  } finally {
    const newState = store.set('selectedRover', ''); // reset selectedRover
    updateStore(store, newState);
  }
};

// -------------------------------------------------------- HELPERS
/* Helper to convert date format
 * @param {string} dateStr - sting in YYYY-MM-DD format
 * @returns - string in MM-DD-YYYY format
 */
const convertDate = (dateStr) => {
  if (dateStr) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(5, 7);
    const day = dateStr.substring(8, 10);

    return `${month}-${day}-${year}`;
  }
};
