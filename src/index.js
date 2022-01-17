import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderCardsTpl from './templates/renderCardsTpl';
import { onFetchImages } from './api-images';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

export let page = 1;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.btn__load-more'),
};

refs.form.addEventListener('submit', onButtonSearchImagesClick);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

let searchQuery = '';
const per_page = 40;

isHideButtonLoadMore();

let gallery;

async function onButtonSearchImagesClick(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return emptySearchQuery();
  }

  resetPageNumber();
  isHideButtonLoadMore();

  try {
    const { hits, totalHits } = await onFetchImages(searchQuery);

    if (hits.length === 0 || hits === 'undefined') {
      cleaningMarkupGallery();
      return errorPayload();
    }

    cleaningMarkupGallery();
    successPayload(totalHits);
    renderImages(hits);
    gallery = new SimpleLightbox('.gallery a');
    scrollDownPage();
    incrementPageNumber();
    isVisibleButtonLoadMore();
  } catch (error) {
    Notify.failure(error.message);
  }
}

async function onButtonLoadMoreClick() {
  isHideButtonLoadMore();

  try {
    const { hits, totalHits } = await onFetchImages(searchQuery);

    if (hits.length === 0 || hits === 'undefined') {
      return errorPayload();
    }

    if (page * per_page > totalHits) {
      return Notify.failure('We are sorry, but you have reached the end of search results.');
    }

    renderImages(hits);
    gallery.refresh();
    scrollDownPage();
    incrementPageNumber();
    isVisibleButtonLoadMore();
  } catch (error) {
    Notify.failure(error.message);
  }
}

function renderImages(hits) {
  const markup = renderCardsTpl(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function cleaningMarkupGallery() {
  refs.gallery.innerHTML = '';
}

function errorPayload() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function successPayload(totalHits) {
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

function scrollDownPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 12,
    behavior: 'smooth',
  });
}
