document.addEventListener('DOMContentLoaded', () => {
    // Show forgot password form when button is clicked
    document.getElementById('forgot-password-btn').addEventListener('click', () => {
        document.getElementById('forgot-password-section').style.display = 'block';
    });

    // Handle forgot password form submission
    document.getElementById('forgot-password-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('forgot-email').value;

        try {
            const response = await axios.post('http://localhost:4000/api/password/forgotpassword', { email });
            alert('Reset link sent!');
        } catch (error) {
            console.error('Error sending reset link:', error);
            alert('Failed to send reset link.');
        }
    });
}); 