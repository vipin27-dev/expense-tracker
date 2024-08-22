document.getElementById('leaderboard-btn').addEventListener('click', fetchAndDisplayLeaderboard);

function fetchAndDisplayLeaderboard() {
  const token = localStorage.getItem('token'); // Or however you are storing the token

  axios.get('http://localhost:4000/api/leaderboard', {
    headers: {
      'Authorization': `Bearer ${token}` // Include the token in the request headers
    }
  })
  .then(response => {
    console.log("Leaderboard data:", response.data);
    displayLeaderboard(response.data.leaderboard);
  })
  .catch(error => {
    console.error("Error fetching leaderboard:", error);
  });
}

function displayLeaderboard(leaderboard) {
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Check if the element exists
  if (!leaderboardList) {
    console.error("Leaderboard list element not found");
    return;
  }
  
  leaderboardList.innerHTML = ''; // Clear previous content

  leaderboard.forEach(user => {
    const listItem = document.createElement('li');
    const totalExpense = user.totalExpense ? parseFloat(user.totalExpense).toFixed(2) : '0.00'; // Ensure value is defined
    listItem.textContent = `${user.name}: $${totalExpense}`;
    leaderboardList.appendChild(listItem);
  });
}
