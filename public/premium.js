document.addEventListener("DOMContentLoaded", () => {
  const buyPremiumBtn = document.getElementById("buy-premium-btn");

  if (buyPremiumBtn) {
    buyPremiumBtn.addEventListener("click", () => {
      axios.post("http://localhost:4000/api/purchase/premium", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(response => {
        const { order, key_id } = response.data; // Destructure order and key_id from response data
        const options = {
          key: key_id, // Use the key_id from the response
          amount: order.amount,
          currency: "INR",
          order_id: order.id,
          handler: async function(response) {
            try {
              await axios.post("http://localhost:4000/api/purchase/update", {
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                status: "SUCCESSFUL"
              }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
              });
              alert("Transaction Successful!");

              // Redirect to premiumUser.html after a successful transaction
              window.location.href = "premiumuser.html";
            } catch (error) {
              console.error("Error during payment update:", error);
              alert("Transaction Failed.");
            }
          },
          prefill: {
            name: "Your Name",
            email: "your@example.com",
          }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
      })
      .catch(error => {
        console.error("Error initiating payment:", error);
        alert("Failed to initiate payment.");
      });
    });
  }
});
