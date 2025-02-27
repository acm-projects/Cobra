document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signin-form');
    const errorMessage = document.getElementById('error-message');
  
    //see if already authenticated
    Auth.isAuthenticated().then(isAuth => {
      if (isAuth) {
        window.location.href = 'sidepanel.html';
      }
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const success = await Auth.signIn(email, password);
        if (success) {
          window.location.href = 'sidepanel.html';
        } else {
          errorMessage.textContent = 'Invalid email or password';
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Error during sign in:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
  }); 


  /*

  SIGNUP.JS

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signin-form');
  const errorMessage = document.getElementById('error-message');

  // Check if already authenticated
  Auth.isAuthenticated().then(isAuth => {
    if (isAuth) {
      window.location.href = 'sidepanel.html';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const success = await Auth.signIn(email, password);
      if (success) {
        window.location.href = 'sidepanel.html';
      } else {
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      errorMessage.textContent = 'An error occurred. Please try again.';
      errorMessage.style.display = 'block';
    }
  });
}); 

*/

