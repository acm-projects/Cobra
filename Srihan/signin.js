document.addEventListener('DOMContentLoaded', () => {
    //get form and error message elements
    const form = document.getElementById('signinForm');
    const errorMessage = document.getElementById('errorMessage');
  
    //check if the user is already authenticated
    Auth.isAuthenticated().then(isAuth => {
      //if authenticated, redirect to the popup page
      if (isAuth) {
        window.location.href = 'popup.html';
      }
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 
      
      //get the email and password values from the form fields
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        //sign in with the provided email and password
        const success = await Auth.signIn(email, password);
        
        //if they sign in, redirect to popup page'
        if (success) {
          window.location.href = 'popup.html';
        } else {
          //display an error message for sign in
          errorMessage.textContent = 'Invalid email or password';
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        //display an error message for sign in
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
  }); 
  