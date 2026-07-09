import { supabase } from './services/supabase';
import { getCurrentUser, logoutUser } from './services/auth';

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await getCurrentUser();
  
  // Route Guard: Redirect to login if user isn't logged in
  if (!currentUser) {
    window.location.href = '/login.html';
    return;
  }

  // Bind navbar logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await logoutUser();
    window.location.href = '/index.html';
  });

  // Bind Form Submission
  document.getElementById('listing-form').addEventListener('submit', handleSaveListing);

  loadUserListings();
});

async function loadUserListings() {
  const grid = document.getElementById('user-listings-grid');
  grid.innerHTML = '<div class="text-muted">Loading your items...</div>';

  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', currentUser.id);

  if (error) {
    grid.innerHTML = `<div class="alert alert-danger">Error loading items: ${error.message}</div>`;
    return;
  }

  if (listings.length === 0) {
    grid.innerHTML = `<div class="col-10 py-4 text-muted"><h3>No items posted yet!</h3><p>Click "Add New Item" above to get started.</p></div>`;
    return;
  }

  grid.innerHTML = '';
  listings.forEach(item => {
    grid.innerHTML += `
      <div class="col">
        <div class="card h-100 shadow-sm border-0">
          <img src="${item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}" class="card-img-top object-fit-cover" style="height: 180px;">
          <div class="card-body">
            <h5 class="card-title fw-bold">${item.title}</h5>
            <p class="fs-5 fw-bold text-primary">$${item.price}</p>
            <p class="text-muted text-truncate">${item.description || ''}</p>
          </div>
          <div class="card-footer bg-transparent border-0 d-flex gap-2 pb-3">
            <button class="btn btn-outline-danger btn-sm w-100" onclick="deleteItem('${item.id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}

async function handleSaveListing(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const imageFile = document.getElementById('itemImage').files[0];
  
  let image_url = '';

  try {
    // If an image is selected, upload it to Supabase Storage bucket named 'item-photos'
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('item-photos')
        .getPublicUrl(filePath);
        
      image_url = urlData.publicUrl;
    }

    // Insert Item into Database table
    const { error } = await supabase.from('listings').insert([
      {
        title,
        price: parseFloat(price),
        description,
        image_url: image_url || null,
        user_id: currentUser.id
      }
    ]);

    if (error) throw error;

    alert('Item published successfully!');
    location.reload();
  } catch (error) {
    alert('Failed to save listing: ' + error.message);
  }
}

// Attach Delete function to window object so inline onclick triggers it
window.deleteItem = async (id) => {
  if (!confirm('Are you sure you want to remove this item?')) return;

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error deleting item: ' + error.message);
  } else {
    alert('Item deleted successfully!');
    location.reload();
  }
};