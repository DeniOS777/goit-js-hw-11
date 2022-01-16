import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderCardsTpl from './templates/renderCardsTpl';

import './css/styles.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.btn__load-more'),
};

isHideButtonLoadMore();

refs.form.addEventListener('submit', onButtonSearchImagesClick);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

let searchQuery = '';
let page = 1;
const per_page = 40;

function onButtonSearchImagesClick(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return emptySearchQuery();
  }

  resetPage();
  isHideButtonLoadMore();

  onFetchImages(searchQuery)
    .then(images => {
      if (images.hits.length === 0 || images.hits === 'undefined') {
        cleaningMarkupGallery();
        return errorPayload();
      }

      cleaningMarkupGallery();
      successPayload(images);
      renderImages(images);
      incrementPage();
      isVisibleButtonLoadMore();
    })
    .catch(error => console.log(error));
}

function onButtonLoadMoreClick() {
  isHideButtonLoadMore();

  onFetchImages(searchQuery)
    .then(images => {
      if (images.hits.length === 0 || images.hits === 'undefined') {
        return errorPayload();
      }
      if (page * per_page > images.totalHits) {
        return Notify.failure('We are sorry, but you have reached the end of search results.');
      }
      renderImages(images);
      incrementPage();
      isVisibleButtonLoadMore();
    })
    .catch(error => console.log(error));
}

function onFetchImages(searchQuery) {
  const searchParams = new URLSearchParams({
    key: '25243201-da43b78e8715fb1cc3094e420',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  return fetch(`https://pixabay.com/api/?${searchParams}`).then(resolve => {
    if (resolve.status !== 200) {
      throw new Error(response.status);
    }
    return resolve.json();
  });
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

function isVisibleButtonLoadMore() {
  refs.buttonLoadMore.classList.remove('is-hide');
}

function isHideButtonLoadMore() {
  refs.buttonLoadMore.classList.add('is-hide');
}

function incrementPage() {
  page += 1;
}

function resetPage() {
  page = 1;
}
