import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_wZofELtVaZfNtzv7yqgfLPJK0OZHU8Vzv5kai2x0xmNZwu570obG96ufNTp3XSot';

const selectElement = document.querySelector('.breed-select');
const catInfoContainer = document.querySelector('.cat-info');

// get&render breeds list - breed select element
function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds').then(response => {
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    return response.data;
  });
}

function renderBreedsList(breeds) {
  const markup = breeds
    .map(breed => {
      return `<option value="${breed.id}">${breed.name}</option>`;
    })
    .join('');
  selectElement.innerHTML = markup;
}

// get&render cat info - cat info container
function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    });
}

function renderCatInfo(cat) {
  console.log(cat);
  console.log(cat[0]);
  const catImage = cat[0].url;
  const catName = cat[0].breeds[0].name;
  const catDescription = cat[0].breeds[0].description;
  const catTemperament = cat[0].breeds[0].temperament;

  const catMarkup = `
    <img src="${catImage}" alt="${catName} image">
    <h2>${catName}</h2>
    <p>${catDescription}</p>
    <p>${catTemperament}</p>
  `;
  catInfoContainer.innerHTML = catMarkup;
}

fetchBreeds()
  .then(breeds => renderBreedsList(breeds))
  .catch(error => console.log(error));

selectElement.addEventListener('change', () => {
  const selectedBreedId = selectElement.value;
  console.log(selectedBreedId);
  fetchCatByBreed(selectedBreedId)
    .then(cat => renderCatInfo(cat))
    .catch(error => console.log(error));
});
