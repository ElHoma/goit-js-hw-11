import cardTempalte from './js/htmlCardTemplate';
import { Report, Block } from 'notiflix';
import pixabay from './js/pixabay';

const PER_PAGE = 40;
let currentPage = 0;

const formEl = document.getElementById('search-form');
const queryInputEl = formEl.elements.searchQuery;
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

formEl.addEventListener('submit', onSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onSubmit(evnt) {
  evnt.preventDefault();
  clearGallery();
  switchLoadMoreBtn();
  loadPhotos();
}

function clearGallery() {
  galleryEl.innerHTML = '';
  currentPage = 0;
}

function switchLoadMoreBtn() {
  if (loadMoreBtnRef.classList.contains('is-hidden')) {
    loadMoreBtnRef.classList.remove('is-hidden');
    return;
  }
  loadMoreBtnRef.classList.add('is-hidden');
}

async function loadPhotos() {
  switchLoadMoreBtn();
  Block.dots('body', 'Loading...');

  try {
    const q = queryInputEl.value;
    const response = await fetchPictures(q);
    const markup = markupImageCards(response.data);
    renderGallery(markup);
  } catch (err) {
    processError(err);
  } finally {
    Block.remove('body');
  }
}

async function onLoadMore(evnt) {
  evnt.preventDefault();
  loadPhotos();
}

async function fetchPictures(q) {
  const params = {
    q,
    per_page: PER_PAGE,
    page: ++currentPage,
  };
  const response = await pixabay.searchPictures(params);
  return response;
}

function markupImageCards(data) {
  const { total, hits } = data;
  if (!total) {
    showWarning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return '';
  }
  const markup = hits.reduce((gallery, image) => {
    gallery += cardTempalte(image);
    return gallery;
  }, '');
  const loadMore = getPagesLeft(total);
  if (loadMore) {
    switchLoadMoreBtn(true);
  }
  return markup;
}

function getPagesLeft(total) {
  const totalPages = Math.ceil(total / PER_PAGE);
  return totalPages - currentPage;
}

function renderGallery(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function showWarning(message) {
  Report.warning('Ooops!', message);
}

function showError(title, message) {
  Report.failure(title, message, 'Okay');
}

function processError(err) {
  const title = err.name ? `Error: ${err.name}` : 'Error';
  showError(title, err.message);
  console.error(err);
}
