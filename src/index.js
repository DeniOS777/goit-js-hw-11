import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderCardsTpl from './templates/renderCardsTpl';

import './css/styles.css';

// const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.btn__load-more'),
};

refs.buttonLoadMore.classList.toggle('is-hide');

refs.form.addEventListener('submit', onButtonSearchImagesClick);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

let searchQuery = '';
let page = 1;

function onButtonSearchImagesClick(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return emptySearchQuery();
  }

  onFetchImages(searchQuery)
    .then(images => {
      if (images.hits.length === 0 || images.hits === 'undefined') {
        cleaningMarkupGallery();
        return errorPayload();
      }

      cleaningMarkupGallery();
      successPayload(images);
      renderImages(images);
      refs.buttonLoadMore.classList.toggle('is-hide');
    })
    .catch(error => console.log(error));
}

function onButtonLoadMoreClick() {
  onFetchImages(searchQuery)
    .then(images => {
      if (images.hits.length === 0 || images.hits === 'undefined') {
        return errorPayload();
      }
      page += 1;
      renderImages(images);
    })
    .catch(error => console.log(error));
}

function onFetchImages(searchQuery) {
  const searchParams = new URLSearchParams({
    key: '25243201-da43b78e8715fb1cc3094e420',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });
  return fetch(`https://pixabay.com/api/?q=${searchQuery}&${searchParams}&page=${page}`).then(
    resolve => {
      if (resolve.status !== 200) {
        throw new Error(response.status);
      }
      return resolve.json();
    },
  );
}

function renderImages({ hits }) {
  const markup = renderCardsTpl(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function cleaningMarkupGallery() {
  refs.gallery.innerHTML = '';
}

function errorPayload() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function successPayload({ totalHits }) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function emptySearchQuery() {
  Notify.info('Field of search is empty, enter please keyword or words for begin search');
}
