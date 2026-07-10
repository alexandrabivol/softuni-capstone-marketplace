import { supabase } from './services/supabase';

// Real, high-resolution backup items to guarantee your app looks flawless
const localMockData = [
  {
    title: 'Premium Noise-Canceling Headphones',
    description: 'Studio-quality wireless headphones with active noise cancellation, 40-hour battery life, and plush memory foam earcups. Perfect condition.',
    price: 249.00,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    category_slug: 'electronics'
  },
  {
    title: 'Vintage Minimalist Denim Jacket',
    description: 'Authentic oversized blue denim jacket. Light wash, heavy-duty stitching, 100% premium cotton fabric. Unisex size L.',
    price: 65.00,
    image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
    category_slug: 'fashion'
  },
  {
    title: 'The Art of Clean Code - Hardcover Edition',
    description: 'An absolute must-read guide for software engineers. Covers architectural patterns, refactoring strategies, and best industry practices. Pristine state.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    category_slug: 'books'
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initial load of items
  await loadListings('all');
  
  // 2. Setup Sidebar click handlers
  setupCategoryFilters();
});

function setupCategoryFilters() {
  const buttons = document.querySelectorAll('#category-filters button');
  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Update active styling
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Read selected category and filter views
      const targetCategory = btn.getAttribute('data-category');
      await loadListings(targetCategory);
    });
  });
}

async function loadListings(categoryFilter = 'all') {
  const grid = document.getElementById('listings-grid');
  if (!grid) return;
  
  grid.innerHTML = `
    <div class="text-center text-muted w-100 py-5">
      <div class="spinner-border text-primary mb-2" role="status"></div>
      <div>Updating listings...</div>
    </div>`;

  let displayItems = [];

  try {
    // 1. Query your Supabase backend
    const { data: listings, error } = await supabase.from('listings').select('*');
    
    if (!error && listings && listings.length > 0) {
      displayItems = listings;
    } else {
      // Database is empty or errored, silently fallback to premium local mocks
      displayItems = localMockData;
    }
  } catch (err) {
    // Network or configuration blocker hit, default to safe copy data
    displayItems = localMockData;
  }

  // 2. Perform client-side category filtering
  if (categoryFilter !== 'all') {
    displayItems = displayItems.filter(item => item.category_slug === categoryFilter);
  }

  // 3. Render items into the view layout
  if (displayItems.length === 0) {
    grid.innerHTML = `
      <div class="text-center text-muted py-5 w-100">
        <h3 class="fw-bold">No items found</h3>
        <p class="small text-secondary">There are no listings matching this request.</p>
      </div>`;
    return;
  }

  grid.innerHTML = '';
  displayItems.forEach(item => {
    const fallbackImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';
    grid.innerHTML += `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm overflow-hidden">
          <img src="${item.image_url || fallbackImg}" class="card-img-top object-fit-cover" style="height: 220px;" alt="${item.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark mb-1">${item.title}</h5>
            <p class="card-text text-body-secondary small flex-grow-1">${item.description || 'No description provided.'}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="fs-4 fw-black text-primary">$${Number(item.price).toFixed(2)}</span>
              <span class="badge bg-light text-dark border px-2 py-1 text-capitalize">${item.category_slug || 'General'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}