import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_wZofELtVaZfNtzv7yqgfLPJK0OZHU8Vzv5kai2x0xmNZwu570obG96ufNTp3XSot';

const selectElement = document.querySelector('.breed-select');

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
    .get('https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}')
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    });
}

fetchBreeds()
  .then(breeds => renderBreedsList(breeds))
  .catch(error => console.log(error));
