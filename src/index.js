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
      console.log(images);
      console.log(images.total);
    })
    .catch(error => console.log(error));
}

function onFetchImages(searchQuery) {
  return fetch(
    `https://pixabay.com/api/?key=25243201-da43b78e8715fb1cc3094e420&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`,
  ).then(resolve => {
    if (resolve.status !== 200) {
      throw new Error(error.message);
    }
    console.log(resolve);
    return resolve.json();
  });
}
