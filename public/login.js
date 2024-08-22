document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupButton = document.getElementById("signup-button");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      console.log('Email:', email);
      console.log('Password:', password);

      try {
        const response = await axios.post("/api/login", { email, password });

        console.log('Response:', response);

        if (response.data.token) {
          localStorage.setItem('token', response.data.token); 
          console.log('Token stored:', localStorage.getItem('token'));
          window.location.href = "/add-expense";
        } else {
          alert("Login failed. Please try again.");
        }
      } catch (error) {
        console.error('Error during login:', error);
        if (error.response) {
          console.log('Error Response:', error.response);
          if (error.response.status === 404) {
            alert("User not found. Please sign up.");
            window.location.href = "/signup"; 
          } else if (error.response.status === 401) {
            alert("Incorrect password. Please try again.");
          } else {
            alert("An error occurred during login. Please try again.");
          }
        } else {
          alert("An unknown error occurred. Please try again.");
        }
      }
    });
  }

  if (signupButton) {
    signupButton.addEventListener("click", () => {
      window.location.href = "/signup";
    });
  }
});
