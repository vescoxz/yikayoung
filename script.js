const works = [
  { name: 'zara-larsson', category: 'artist', description: 'Zara Larsson — selected poster archive.' },
  { name: 'bigbang', category: 'artist', description: 'BIGBANG — selected poster archive.' },
  { name: '2026-rapbeat', category: 'event', description: '2026 RAPBEAT — selected event poster.' },
  { name: '2023-bruno-mars', category: 'event', description: '2023 Bruno Mars — selected event poster.' },
  { name: '2022-brb', category: 'event', description: '2022 BRB — selected event poster.' },
  { name: 'sam-smith', category: 'artist', description: 'Sam Smith — selected poster archive.' },
  { name: '82major', category: 'artist', description: '82MAJOR — selected poster archive.' },
  { name: 'epikhigh', category: 'artist', description: 'Epik High — selected poster archive.' },
  { name: '2024-rapbeat', category: 'event', description: '2024 RAPBEAT — selected event poster.' },
  { name: 'slsl', category: 'event', description: 'SLSL — selected event poster.' },
  { name: '2023-honne', category: 'event', description: '2023 HONNE — selected event poster.' },
  { name: 'nbhd', category: 'artist', description: 'NBHD — selected poster archive.' },
  { name: 'kendrick-lamar', category: 'artist', description: 'Kendrick Lamar — selected poster archive.' }
];

const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
const imageCache = {};

function getImagePath(name, index) {
  if (imageCache[name]) return imageCache[name];
  const base = `assets/${name}`;
  return `${base}.jpg`;
}

function setupImageFallback(img, name) {
  let attempt = 0;
  img.src = getImagePath(name);
  img.onerror = () => {
    attempt++;
    if (attempt < extensions.length) {
      img.src = `assets/${name}${extensions[attempt]}`;
    } else {
      img.onerror = null;
      img.classList.add('image-missing');
      img.alt = `${name} 이미지를 assets 폴더에 넣어주세요`;
    }
  };
}

const grid = document.getElementById('workGrid');

function renderWorks(category = 'all') {
  grid.innerHTML = '';
  works.forEach((work, index) => {
    if (category !== 'all' && work.category !== category) return;

    const card = document.createElement('article');
    card.className = 'work-card';
    card.dataset.category = work.category;
    card.innerHTML = `
      <div class="work-image">
        <img alt="${work.name}">
      </div>
      <div class="work-meta">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>${work.name}</h3>
          <p>${work.category.toUpperCase()}</p>
        </div>
      </div>
    `;
    const img = card.querySelector('img');
    setupImageFallback(img, work.name);
    card.addEventListener('click', () => openModal(work, img.src));
    grid.appendChild(card);
  });
}

renderWorks();

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderWorks(button.dataset.category);
  });
});

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesigner = document.getElementById('modalDesigner');
const modalDescription = document.getElementById('modalDescription');
const modalCategory = document.getElementById('modalCategory');

function openModal(work, src) {
  modalTitle.textContent = work.name;
  modalDesigner.textContent = work.category.toUpperCase();
  modalCategory.textContent = `${String(works.indexOf(work) + 1).padStart(2, '0')} / 13`;
  modalDescription.textContent = work.description;
  modalImage.src = src;
  modalImage.alt = work.name;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
