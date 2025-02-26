document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');
  
    Auth.isAuthenticated().then(isAuth => {
      if (isAuth) {
        window.location.href = 'sidepanel.html';
      }
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      try {
        if (!name || !email || !password || !confirmPassword) {
          showError('Please fill in all fields');
          return;
        }
  
        if (password !== confirmPassword) {
          showError('Passwords do not match');
          return;
        }
  
        if (password.length < 6) {
          showError('Password must be at least 6 characters long');
          return;
        }
  
        const success = await Auth.signUp(name, email, password);
        if (success) {
          await Auth.signIn(email, password);
          window.location.href = 'sidepanel.html';
        } else {
          showError('Could not create account. Please try again.');
        }
      } catch (error) {
        console.error('Error during sign up:', error);
        showError('An error occurred. Please try again.');
      }
    });
  
    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
  }); 