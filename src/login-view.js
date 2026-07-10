import { loginUser } from './services/auth.js';
import { getCurrentUser } from './services/auth.js';

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
      const userOrSession = await loginUser(email, password);
      
      if (userOrSession) {
        const confirmedUser = await getCurrentUser({ waitForSession: true, timeoutMs: 2500 });

        if (!confirmedUser) {
          throw new Error('Session was not ready. Please try signing in again.');
        }

        if (errorAlert) errorAlert.classList.add('d-none');
        
        console.log("Authentication signature established! Writing local assets...");

        window.location.href = '/dashboard.html';
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