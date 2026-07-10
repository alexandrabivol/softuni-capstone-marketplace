import { loginUser } from './services/auth.js';

const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorAlert = document.getElementById('error-alert');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Authenticating session...';
    }

    try {
      // 1. Await server authentication
      const user = await loginUser(email, password);
      
      if (user) {
        if (errorAlert) errorAlert.classList.add('d-none');
        
        console.log("Authentication signature established! Writing local assets...");

        // 2. CRITICAL SAFETY PAUSE (Fixes the instant redirect bug):
        // Delaying the window change by 350ms gives the Supabase library 
        // the time it needs to fully write the local storage token before the page changes.
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 350);
      }
    } catch (err) {
      console.error("Login failure caught:", err.message);
      if (errorAlert) {
        errorAlert.innerText = err.message || 'Invalid email or password configuration.';
        errorAlert.classList.remove('d-none');
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Log In';
      }
    }
  });
}