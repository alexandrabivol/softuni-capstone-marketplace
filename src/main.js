// Import Bootstrap's CSS bundle
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCurrentUser } from './services/auth';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Vite + Bootstrap Marketplace Application Loaded Successfully!");
  
  // Check if a user session exists right away
  const user = await getCurrentUser();
  if (user) {
    console.log("Welcome back user:", user.email);
  }
});