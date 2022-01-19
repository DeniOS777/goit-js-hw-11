import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderCardsTpl from './templates/renderCardsTpl';
import { ImagesApiService } from './images_service';
import { refs } from './refs';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

refs.form.addEventListener('submit', onButtonSearchImagesClick);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

const imagesApiService = new ImagesApiService();

let galleryModal = new SimpleLightbox('.gallery a');

isHideButtonLoadMore();

async function onButtonSearchImagesClick(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!imagesApiService.query) {
    return imagesApiService.emptySearchQuery();
  }

  imagesApiService.resetPageNumber();
  isHideButtonLoadMore();

  try {
    const { hits, totalHits } = await imagesApiService.onFetchImages();

    if (hits.length === 0) {
      cleaningMarkupGallery();
      return imagesApiService.errorPayload();
    }

    cleaningMarkupGallery();
    imagesApiService.successPayload(totalHits);
    renderImages(hits);
    scrollDownPage();
    galleryModal.refresh();

    if (imagesApiService.page * imagesApiService.per_page > totalHits) {
      return setTimeout(() => {
        Notify.failure('We are sorry, but you have reached the end of search results.');
      }, 2000);
    }

    isVisibleButtonLoadMore();
  } catch (error) {
    Notify.failure(error.message);
  }
}

async function onButtonLoadMoreClick() {
  isHideButtonLoadMore();

  try {
    const { hits, totalHits } = await imagesApiService.onFetchImages();

    if (hits.length === 0) {
      return imagesApiService.errorPayload();
    }

    renderImages(hits);
    scrollDownPage();
    galleryModal.refresh();

    if (imagesApiService.page * imagesApiService.per_page > totalHits) {
      return setTimeout(() => {
        Notify.failure('We are sorry, but you have reached the end of search results.');
      }, 1500);
    }

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

function isVisibleButtonLoadMore() {
  refs.buttonLoadMore.classList.remove('is-hide');
}

function isHideButtonLoadMore() {
  refs.buttonLoadMore.classList.add('is-hide');
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
