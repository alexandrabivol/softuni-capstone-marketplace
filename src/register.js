import { registerUser } from './services/auth';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    await registerUser(email, password, fullName);
    alert('Registration successful! Please check your email for verification link or log in.');
    window.location.href = '/login.html';
  } catch (error) {
    alert('Error during registration: ' + error.message);
  }
});