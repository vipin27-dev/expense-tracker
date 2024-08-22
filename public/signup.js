document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await axios.post("/api/signup", {
          name,
          email,
          password,
        });
        alert(response.data.message);
        
        if (response.data.success) {
          window.location.href = "/"; 
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message); 
        } else {
          alert("An error occurred during signup. Please try again."); 
        }
        console.error("Error during signup:", error);
      }
    });
  }
});
