export default function cardTemplate(data) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = data;
  return `
  <li class="gallery__item photo-card">
    <a class="gallery__link photo" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <div class="info-item">
        <p><b>Likes</b></p>
        <p>${likes}</p>
      </div>
      <div class="info-item">
        <p><b>Views</b></p>
        <p>${views}</p>
      </div>
      <div class="info-item">
        <p><b>Comments</b></p>
        <p>${comments}</p>
      </div>
      <div class="info-item">
        <p><b>Downloads</b></p>
        <p>${downloads}</p>
      </div>
    </div>
  </li>`;
}
