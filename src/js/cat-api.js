import axios from 'axios';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

axios.defaults.headers.common['x-api-key'] =
  'live_wZofELtVaZfNtzv7yqgfLPJK0OZHU8Vzv5kai2x0xmNZwu570obG96ufNTp3XSot';

const selectElement = document.querySelector('.breed-select');
const catInfoContainer = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
// const error = document.querySelector('.error');

// get&render breeds list - breed select element
function fetchBreeds() {
  showLoader();
  hideSelectElement();
  // hideError();
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    })
    .catch(error => {
      hideSelectElement();
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      // showError();
    })
    .finally(() => {
      hideLoader();
    });
}

function renderBreedsList(breeds) {
  const options = breeds.map(breed => {
    return {
      text: breed.name,
      value: breed.id,
    };
  });
  new SlimSelect({
    select: '.breed-select',
    data: options,
  });
}

// get&render cat info - cat info container
function fetchCatByBreed(breedId) {
  hideCatInfo();
  showLoader();
  // hideError();
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader();
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
  <img class ="card__image" src="${catImage}" alt="${catName} image">
  <div class="card__content">
      <h2 class="card__heading">${catName}</h2>
      <p class="card__description">${catDescription}</p>
      <p class="card__text"><span class="bold">Temperament: </span>${catTemperament}</p>
  </div>
`;
  catInfoContainer.innerHTML = catMarkup;
}

// hide & show block functions
function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

// function showError() {
//   error.style.display = 'block';
// }

// function hideError() {
//   error.style.display = 'none';
// }

function showCatInfo() {
  catInfoContainer.style.display = 'flex';
}

function hideCatInfo() {
  catInfoContainer.style.display = 'none';
}

function showSelectElement() {
  selectElement.classList.remove('hidden');
}

function hideSelectElement() {
  selectElement.classList.add('hidden');
}

hideCatInfo();
hideLoader();
// hideError();

fetchBreeds()
  .then(breeds => {
    renderBreedsList(breeds);
    showSelectElement();
  })
  .catch(error => console.log(error));

selectElement.addEventListener('change', () => {
  const selectedBreedId = selectElement.value;
  console.log(selectedBreedId);

  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      renderCatInfo(cat);
      showCatInfo();
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      // showError();
    });
});
