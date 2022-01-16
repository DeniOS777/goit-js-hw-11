import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderCardsTpl from './templates/renderCardsTpl';

import './css/styles.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.btn__load-more'),
};

refs.form.addEventListener('submit', onButtonSearchImagesClick);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

isHideButtonLoadMore();

let searchQuery = '';
let page = 1;
const per_page = 40;

function onButtonSearchImagesClick(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return emptySearchQuery();
  }

  resetPageNumber();
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
      incrementPageNumber();
      isVisibleButtonLoadMore();
    })
    .catch(error => console.log(error.message));
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
      incrementPageNumber();
      isVisibleButtonLoadMore();
    })
    .catch(error => console.log(error.message));
}

async function onFetchImages(searchQuery) {
  const searchParams = new URLSearchParams({
    key: '25243201-da43b78e8715fb1cc3094e420',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  // return axios.get(`https://pixabay.com/api/?${searchParams}`).then(response => response.data);
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  const data = response.data;
  return data;
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

function incrementPageNumber() {
  page += 1;
}

function resetPageNumber() {
  page = 1;
}
