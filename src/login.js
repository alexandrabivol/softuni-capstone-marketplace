import { loginUser } from './services/auth';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    await loginUser(email, password);
    alert('Login successful!');
    window.location.href = '/dashboard.html'; // Redirects to the dashboard
  } catch (error) {
    alert('Error during login: ' + error.message);
  }
});