let store = {
  user: { name: 'Student' },
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selectedRover: '',
  roverData: [],
};

// add markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { roverData } = state;

  console.log('store', store);
  // interface to select rover
  // click on button (3 buttons)
  // send rover name with request
  // display rover info on page
  return `
        <header></header>
        <main>
            ${selectRover()}
            ${roverData.length > 0 ? displayRoverData() : ``}
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// get rover name to trigger api call
const setRover = (state) => {
  let rover = state;
  console.log('click', rover);
  updateStore(store, { selectedRover: rover });
  console.log('store', store);
  triggerRoverApi(store.selectedRover); // render
};

// select a rover
const selectRover = () => {
  return `
  <button onclick="setRover('curiosity')">Curiosity</button>
  <button onclick="setRover('opportunity')">Opportunity</button>
  <button onclick="setRover('spirit')">Spirit</button>
  `;
};

// clean-up rover data
const transformRoverData = (images) => {
  console.log('images to transform', images);
  const data = images.map((item) => {
    return {
      name: item.rover.name,
      image: item.img_src,
      launchDate: item.rover.launch_date,
      landingDate: item.rover.landing_date,
      status: item.rover.status,
    };
  });
  console.log('data', data);
  // update store
  updateStore(store, { roverData: data });
};

// add rover images to DOM
const displayRoverData = () => {
  return `<ul>
          ${store.roverData
            .map(
              (item) =>
                `<li>
                  ${item.name}
                  ${item.image}
                  ${item.launchDate}
                  ${item.landingDate}
                  ${item.status}
                </li>`
            )
            .join('')}
        </ul>`;
};

// conditional to trigger rover api call
const triggerRoverApi = (rover) => {
  if (rover.length > 0) {
    console.log('rover selected');
    getRoverData(rover);
  }
  return;
};

// ------------------------------------------------------  API CALLS

// get rover info - data provider (impure)
const getRoverData = async (state) => {
  const roverName = store.selectedRover; // get roverName from click
  await fetch(`http://localhost:3000/rover/${roverName}`)
    .then((res) => res.json())
    .then(transformRoverData) // update state?
    .catch((err) => console.log(err));
};
