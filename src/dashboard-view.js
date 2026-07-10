import { supabase } from './services/supabase.js';
import { getCurrentUser, logoutUser } from './services/auth.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check for user session
    currentUser = await getCurrentUser();
    
    // Tiny 150ms retry mechanism to completely eliminate production race conditions
    if (!currentUser) {
      await new Promise(resolve => setTimeout(resolve, 150));
      currentUser = await getCurrentUser();
    }
    
    if (!currentUser) {
      console.log("No user session caught. Redirecting to login...");
      window.location.href = '/login.html';
      return;
    }

    console.log("Successfully authenticated user session on dashboard:", currentUser.email);

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      await logoutUser();
      window.location.href = '/index.html';
    });

    document.getElementById('listing-form')?.addEventListener('submit', handleSaveListing);
    
    await loadUserListings();

  } catch (err) {
    console.error("Dashboard initialization block crash caught:", err.message);
  }
});

async function loadUserListings() {
  const grid = document.getElementById('user-listings-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="col-12 text-center text-muted">Retrieving catalog...</div>';

  try {
    if (!currentUser || !currentUser.id) return;

    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', currentUser.id);

    if (error) throw error;

    if (!listings || listings.length === 0) {
      grid.innerHTML = `
        <div class="col-10 py-5 text-center text-muted mx-auto">
          <h4 class="fw-bold">No active items posted yet!</h4>
          <p class="small text-secondary">Click the action button above to write your first catalog entry.</p>
        </div>`;
      return;
    }

    grid.innerHTML = '';
    listings.forEach(item => {
      const fallBack = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';
      grid.innerHTML += `
        <div class="col">
          <div class="card h-100 border-0 shadow-sm overflow-hidden">
            <img src="${item.image_url || fallBack}" class="card-img-top object-fit-cover" style="height: 200px;">
            <div class="card-body">
              <h5 class="card-title fw-bold text-dark">${item.title}</h5>
              <p class="fs-4 fw-black text-primary mb-2">$${Number(item.price).toFixed(2)}</p>
              <p class="card-text text-muted small">${item.description || 'No item details supplied.'}</p>
            </div>
            <div class="card-footer bg-light border-0 pt-0 pb-3">
              <button class="btn btn-outline-danger btn-sm w-100" onclick="deleteItem('${item.id}')">Remove Posting</button>
            </div>
          </div>
        </div>`;
    });
  } catch (error) {
    grid.innerHTML = `<div class="alert alert-danger w-100">Database read breakdown: ${error.message}</div>`;
  }
}

async function handleSaveListing(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const categorySlug = document.getElementById('category')?.value || 'electronics';
  const fileInput = document.getElementById('item-image-file'); 

  let imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'; 

  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'Uploading assets and saving...';
  }

  try {
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_product.${fileExtension}`;
      const filePath = `uploads/${fileName}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('listings').insert([
      {
        title,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
        category_slug: categorySlug,
        user_id: currentUser.id
      }
    ]);

    if (error) throw error;
    alert('Item published successfully with media assets attached!');
    location.reload();
  } catch (error) {
    alert('Listing entry submission breakdown: ' + error.message);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Publish Item';
    }
  }
}

window.deleteItem = async (id) => {
  if (!confirm('Are you sure you want to remove this item?')) return;
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) alert(error.message);
  else location.reload();
};