import axios from 'axios';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

axios.defaults.headers.common['x-api-key'] =
  'live_wZofELtVaZfNtzv7yqgfLPJK0OZHU8Vzv5kai2x0xmNZwu570obG96ufNTp3XSot';

const selectElement = document.querySelector('.breed-select');
const catInfoContainer = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');

// get&render breeds list - breed select element
function fetchBreeds() {
  showElement(loader);
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    })
    .catch(error => {
      console.log(error);
      hideElement(selectElement);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    })
    .finally(() => {
      hideElement(loader);
    });
}

function renderBreedsList(breeds) {
  const options = breeds.map(breed => {
    return {
      text: breed.name,
      value: breed.id,
    };
  });

  options.unshift({
    text: 'Select breed',
    value: '',
    'data-placeholder': true,
  });

  new SlimSelect({
    select: '.breed-select',
    data: options,
    settings: {
      showSearch: false,
    },
  });

  addStyles();
}

fetchBreeds()
  .then(breeds => {
    renderBreedsList(breeds);
    showElement(selectElement);
  })
  .catch(error => {
    console.log(error);
    hideElement(selectElement);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  });

// get&render cat info - cat info container
function fetchCatByBreed(breedId) {
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
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    })
    .finally(() => {
      hideElement(loader);
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

selectElement.addEventListener('change', () => {
  const selectedBreedId = selectElement.value;
  console.log(selectedBreedId);
  if (selectedBreedId !== '') {
    showElement(loader);
    hideElement(catInfoContainer);
    fetchCatByBreed(selectedBreedId)
      .then(cat => {
        renderCatInfo(cat);
        hideElement(loader);
        showElement(catInfoContainer);
      })
      .catch(error => {
        console.log(error);
        Notiflix.Notify.failure(
          'Oops! Something went wrong! Try reloading the page!'
        );
      });
  }
});

// hide & show element functions

function hideElement(element) {
  element.classList.add('hidden');
}

function showElement(element) {
  element.classList.remove('hidden');
}

// style select function
function addStyles() {
  selectElement.classList.add('slim-select');
}
