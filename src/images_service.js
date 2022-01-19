import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async onFetchImages() {
    const searchParams = new URLSearchParams({
      key: '25243201-da43b78e8715fb1cc3094e420',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    });
    const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
    const data = await response.data;
    this.incrementPageNumber();
    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }

  emptySearchQuery() {
    Notify.info('Field of search is empty, enter please keyword or words for begin search');
  }

  incrementPageNumber() {
    this.page += 1;
  }

  resetPageNumber() {
    this.page = 1;
  }

  errorPayload() {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }

  successPayload(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`, { timeout: 1000 });
  }
}
