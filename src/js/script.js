import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
export { gallery };
let query = '';
const loadEl = document.querySelector('.js-guard')
let simpleLightBox;
const perPage = 40;
let totalPages = 0;
const options = {
  rootMargin: '300px',
  threshold: 1.0,
};
let page = 1;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    
    if (entry.isIntersecting) {
      onloadMore();
    }
  });
}, options);

searchForm.addEventListener('submit', onSearchForm);
// Цей код дозволяє автоматично прокручувати сторінку на висоту 2 карток галереї, коли вона завантажується
function onSearchForm(e) {
  e.preventDefault();
  
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  async function makeMarkup(query, page, perPage) {
    try {
      const data = await fetchImages(query, page, perPage);
       totalPages = Math.ceil(data.totalHits / perPage);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(data.hits);
        if (totalPages === 1) {
          return;
        }
        observer.observe(loadEl);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    } catch(error) {
      console.log(error.massage);
    } finally {
      searchForm.reset();
    }
  }
  makeMarkup(query, page, perPage);
}

function onloadMore() {
  page += 1;
  simpleLightBox.destroy();
  if (page > totalPages) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results." 
    );
     observer.unobserve(loadEl)
     return
  }
  async function makeMarkup(query, page, perPage) {
    try {
      const data = await fetchImages(query, page, perPage);
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    } catch(error) {
      console.log(error.massage);
    }
  }
   makeMarkup(query, page, perPage);
 }

// // кнопка “вгору”->
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};
window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});

