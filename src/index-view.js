import { supabase } from './services/supabase';

document.addEventListener('DOMContentLoaded', async () => {
  loadListings('all');
  setupCategoryFilters();
});

function setupCategoryFilters() {
  const buttons = document.querySelectorAll('#category-filters button');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Manage active style cues
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const targetCategory = e.target.getAttribute('data-category');
      loadListings(targetCategory);
    });
  });
}

async function loadListings(categoryFilter = 'all') {
  const grid = document.getElementById('listings-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="text-center text-muted w-100 py-5">Refreshing item feed...</div>';

  let query = supabase.from('listings').select('*');
  
  // Filter query parameters based on category selection
  if (categoryFilter !== 'all') {
    query = query.eq('category_slug', categoryFilter);
  }

  const { data: listings, error } = await query;

  if (error) {
    grid.innerHTML = `<div class="alert alert-danger w-100">Could not retrieve records: ${error.message}</div>`;
    return;
  }

  if (!listings || listings.length === 0) {
    grid.innerHTML = `<div class="text-center text-muted py-5 w-100"><h3>No items listed in this category yet!</h3></div>`;
    return;
  }

  grid.innerHTML = '';
  listings.forEach(item => {
    grid.innerHTML += `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm overflow-hidden">
          <img src="${item.image_url}" class="card-img-top object-fit-cover" style="height: 200px;" alt="${item.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark mb-1">${item.title}</h5>
            <p class="card-text text-muted small flex-grow-1">${item.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="fs-4 fw-bold text-primary">$${item.price}</span>
              <span class="badge bg-light text-secondary border border-secondary-subtle px-2 py-1 text-capitalize">${item.category_slug || 'Market'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}