import { supabase } from './services/supabase';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Core initialization: Boot local catalog view feeds
  await loadListings('all');
  
  // 2. Setup Category Click Listeners
  setupCategoryFilters();
});

function setupCategoryFilters() {
  const buttons = document.querySelectorAll('#category-filters button');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Toggle active design styles across UI panels
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Extract target category value
      const targetCategory = btn.getAttribute('data-category');
      
      // Reload marketplace grids
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
      <div>Syncing with live marketplace database...</div>
    </div>`;

  try {
    // Select all available active columns from our fresh public listings schema table
    let query = supabase.from('listings').select('*');
    
    // Apply server-side category sorting parameters if an explicit category is requested
    if (categoryFilter !== 'all') {
      query = query.eq('category_slug', categoryFilter);
    }

    const { data: listings, error } = await query;

    if (error) throw error;

    if (!listings || listings.length === 0) {
      grid.innerHTML = `
        <div class="text-center text-muted py-5 w-100">
          <h4 class="fw-bold text-dark">No Active Listings Found</h4>
          <p class="small text-secondary">Be the first member to list an item under this filter tab!</p>
        </div>`;
      return;
    }

    grid.innerHTML = '';
    listings.forEach(item => {
      const fallbackImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';
      grid.innerHTML += `
        <div class="col">
          <div class="card h-100 border-0 shadow-sm overflow-hidden">
            <img src="${item.image_url || fallbackImg}" class="card-img-top object-fit-cover" style="height: 220px;" alt="${item.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold text-dark mb-1">${item.title}</h5>
              <p class="card-text text-body-secondary small flex-grow-1">${item.description || 'No item specifications provided.'}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="fs-4 fw-black text-primary">$${Number(item.price).toFixed(2)}</span>
                <span class="badge bg-light text-dark border px-2 py-1 text-capitalize">${item.category_slug || 'General'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Supabase Database Retrieval Error:", err.message);
    grid.innerHTML = `
      <div class="alert alert-danger w-100 m-3 border-0 shadow-sm">
        <h5 class="fw-bold">Database Syncing Offline</h5>
        <p class="small mb-1">${err.message}</p>
        <hr class="my-2 opacity-25">
        <small class="text-secondary d-block">Ensure Vite environment credentials look completely saved inside Vercel Dashboard configurations.</small>
      </div>`;
  }
}