import { supabase } from './services/supabase';
import { getCurrentUser } from './services/auth';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();
  
  // 1. Route Guard: If not logged in, redirect away
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  // 2. Check user roles table to verify authorization status
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError || !userRole || userRole.role !== 'admin') {
    alert('Access Denied: You do not have administrator permissions.');
    window.location.href = '/index.html';
    return;
  }

  // User is authorized admin, load master list
  loadAllListings();
});

async function loadAllListings() {
  const tbody = document.getElementById('admin-listings-table');
  tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Loading administrative records...</td></tr>';

  const { data: listings, error } = await supabase
    .from('listings')
    .select('*');

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading records: ${error.message}</td></tr>`;
    return;
  }

  if (listings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No global listings found.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  listings.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>
          <img src="${item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}" class="rounded object-fit-cover" style="width: 60px; height: 45px;">
        </td>
        <td><strong class="text-dark">${item.title}</strong></td>
        <td><span class="badge bg-success-subtle text-success fs-6">$${item.price}</span></td>
        <td><div class="text-muted text-truncate" style="max-width: 300px;">${item.description || 'No description provided.'}</div></td>
        <td>
          <button class="btn btn-danger btn-sm px-3" onclick="adminForceDelete('${item.id}')">Force Remove</button>
        </td>
      </tr>
    `;
  });
}

// Attach the force delete action to the global window runtime loop
window.adminForceDelete = async (id) => {
  if (!confirm('ADMIN WARNING: Are you sure you want to completely remove this listing?')) return;

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Admin action failed: ' + error.message);
  } else {
    alert('Listing removed successfully by admin choice.');
    loadAllListings();
  }
};