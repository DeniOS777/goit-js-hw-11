import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderCardsTpl from './templates/renderCardsTpl';

import './css/styles.css';

// const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onButtonSearchImagesClick);

function onButtonSearchImagesClick(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return emptySearchQuery();
  }
  // isCleaningMarkupGallery();

  onFetchImages(searchQuery)
    .then(images => {
      if (images.hits.length === 0 || images.hits === 'undefined') {
        return ErrorPayload();
      }
      CleaningMarkupGallery();
      SuccessPayload(images);
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
  });
  return fetch(`https://pixabay.com/api/?q=${searchQuery}&${searchParams}`).then(resolve => {
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

function CleaningMarkupGallery() {
  refs.gallery.innerHTML = '';
}

function ErrorPayload() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function SuccessPayload({ totalHits }) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function emptySearchQuery() {
  Notify.info('Enter please keyword or words for begin search');
}

// function renderImages(images) {
//   const markup = images
//     .map(item => {
//       return `<div class="photo-card">
//   <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>${item.likes}
//     </p>
//     <p class="info-item">
//       <b>Views</b>${item.views}
//     </p>
//     <p class="info-item">
//       <b>Comments</b>${item.comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>${item.downloads}
//     </p>
//   </div>
// </div>`;
//     })
//     .join('');
//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }
