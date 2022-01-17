import axios from 'axios';

import { page } from '.';

export async function onFetchImages(searchQuery) {
  const searchParams = new URLSearchParams({
    key: '25243201-da43b78e8715fb1cc3094e420',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  const data = await response.data;
  return data;
}
