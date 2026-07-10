import { supabase } from './services/supabase';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initial load of all listings
  await loadListings('all');
  
  // 2. Attach click handlers to the category buttons
  setupCategoryFilters();
});

function setupCategoryFilters() {
  const buttons = document.querySelectorAll('#category-filters button');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Remove 'active' class from all buttons, and add it to the clicked one
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Grab the category filter value
      const targetCategory = btn.getAttribute('data-category');
      
      // Reload listings with the selected filter
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
      <div>Loading catalog items...</div>
    </div>`;

  try {
    let query = supabase.from('listings').select('*');
    
    // Apply category filtering if a specific group is clicked
    if (categoryFilter !== 'all') {
      query = query.eq('category_slug', categoryFilter);
    }

    const { data: listings, error } = await query;

    if (error) throw error;

    if (!listings || listings.length === 0) {
      grid.innerHTML = `
        <div class="text-center text-muted py-5 w-100">
          <h3 class="fw-bold">No active listings</h3>
          <p class="small">Be the first to list an item in this category!</p>
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
              <p class="card-text text-muted small flex-grow-1">${item.description || 'No description provided.'}</p>
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
    grid.innerHTML = `
      <div class="alert alert-danger w-100 m-3">
        <strong>Connection Error:</strong> ${err.message}. <br>
        <small class="text-secondary">Please check your Supabase environment variables on Vercel.</small>
      </div>`;
  }
}