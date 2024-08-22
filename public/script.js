// document.addEventListener('DOMContentLoaded', () => {
//   const dailyExpenseList = document.getElementById('daily-expense-list');
//   const weeklyExpenseList = document.getElementById('weekly-expense-list');
//   const monthlyExpenseList = document.getElementById('monthly-expense-list');
//   const leaderboardBtn = document.getElementById('leaderboard-btn');
//   const downloadBtn = document.getElementById('download-btn');
//   const leaderboardList = document.getElementById('leaderboard-list');

//   // Fetch all expenses for the logged-in user
//   async function fetchExpenses() {
//     try {
//       const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:4000/api/add-expense', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         })
//         console.log('API Response:', response.data); 

//         const expenses = response.data.expenses || response.data; 

//         if (Array.isArray(expenses)) {
//             displayExpenses(expenses);
//         } else {
//             console.error('Expected an array of expenses, but got:', expenses);
//             alert('Failed to fetch expenses.');
//         }
//     } catch (error) {
//         console.error('Error fetching expenses:', error.message);
//         alert('Failed to fetch expenses.');
//     }
// }
//   // Display expenses in the table
//   function displayExpenses(expenses) {
//     dailyExpenseList.innerHTML = '';
//     weeklyExpenseList.innerHTML = '';
//     monthlyExpenseList.innerHTML = '';

//     expenses.forEach(expense => {
//       const expenseDate = new Date(expense.date);
//       const row = `<tr>
//         <td>${expense.amount}</td>
//         <td>${expense.description}</td>
//         <td>${expense.type}</td>
//         <td>${expenseDate.toLocaleDateString()}</td>
//       </tr>`;

//       if (isToday(expenseDate)) {
//         dailyExpenseList.innerHTML += row;
//       } else if (isThisWeek(expenseDate)) {
//         weeklyExpenseList.innerHTML += row;
//       } else if (isThisMonth(expenseDate)) {
//         monthlyExpenseList.innerHTML += row;
//       }
//     });
//   }

//   // Helper functions to categorize expenses
//   function isToday(date) {
//     const today = new Date();
//     return date.toDateString() === today.toDateString();
//   }

//   function isThisWeek(date) {
//     const now = new Date();
//     const startOfWeek = now.getDate() - now.getDay();
//     const startOfWeekDate = new Date(now.setDate(startOfWeek));
//     return date >= startOfWeekDate && date <= now;
//   }

//   function isThisMonth(date) {
//     const now = new Date();
//     return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
//   }

//   // Handle leaderboard button click
//   leaderboardBtn.addEventListener('click', async () => {
//     try {
//       const response = await axios.get('/leaderboard');
//       const leaderboard = response.data;
//       displayLeaderboard(leaderboard);
//     } catch (error) {
//       console.error('Error fetching leaderboard:', error.message);
//       alert('Failed to fetch leaderboard.');
//     }
//   });

//   // Display leaderboard
//   function displayLeaderboard(leaderboard) {
//     leaderboardList.innerHTML = ''; // Clear existing rows

//     leaderboard.forEach(user => {
//       const listItem = `<li>${user.username}: ${user.totalExpense}</li>`;
//       leaderboardList.innerHTML += listItem;
//     });
//   }

//   // Fetch initial data
//   fetchExpenses();
// });

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token'); 

  function renderExpenses(expenses) {
    const tableBody = document.getElementById('expensesTableBody');
    tableBody.innerHTML = ''; 

    expenses.forEach(expense => {
      const row = document.createElement('tr');

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = expense.description;
      row.appendChild(descriptionCell);

      const amountCell = document.createElement('td');
      amountCell.textContent = expense.amount;
      row.appendChild(amountCell);

      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(expense.date).toLocaleDateString(); 
      row.appendChild(dateCell);

      tableBody.appendChild(row);
    });
  }

  function fetchExpenses() {
    axios.get('http://localhost:4000/api/add-expense', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Expenses fetched successfully:', response.data);
      renderExpenses(response.data); 
    })
    .catch(error => {
      console.error('Error fetching expenses:', error);
    });
  }
  fetchExpenses();
});
