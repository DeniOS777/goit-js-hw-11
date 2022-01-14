import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onButtonSearchImagesClick);

function onButtonSearchImagesClick(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return;
  }
  onFetchImages(searchQuery)
    .then(images => {
      if (images.hits.length === 0 || images.hits === 'undefined') {
        return console.log(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
      console.log(images);
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
