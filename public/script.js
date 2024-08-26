document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  function renderExpenses(expenses) {
    const tableBody = document.getElementById('expensesTableBody');
    tableBody.innerHTML = ''; 
  
    if (Array.isArray(expenses)) {
      expenses.forEach(expense => {
        const row = document.createElement('tr');
  
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = expense.description || 'N/A'; // Handle missing description
        row.appendChild(descriptionCell);
  
        const amountCell = document.createElement('td');
        amountCell.textContent = expense.amount || 'N/A'; // Handle missing amount
        row.appendChild(amountCell);
  
        const typeCell = document.createElement('td');
        typeCell.textContent = expense.type || 'N/A'; // Handle missing type
        row.appendChild(typeCell);
  
        tableBody.appendChild(row);
      });
    } else {
      console.error('Expected an array for expenses:', expenses);
    }
  }

  function fetchExpenses() {
    axios.get('http://localhost:4000/api/add-expense', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Expenses fetched successfully:', response.data);
      
      // Ensure the response data is an object with an 'expenses' array
      if (response.data && Array.isArray(response.data.expenses)) {
        renderExpenses(response.data.expenses);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    })
    .catch(error => {
      console.error('Error fetching expenses:', error);
    });
  }
  
  function handleDownloadClick() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("You need to be logged in to download expenses.");
      window.location.href = '/'; 
      return;
    }
  
    axios.get('http://localhost:4000/api/download-expenses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.fileUrl) {
        window.location.href = response.data.fileUrl;
      } else {
        console.error('No file URL provided in response.');
      }
    })
    .catch(error => {
      console.error('Error downloading expenses:', error);
      alert("An error occurred while downloading expenses.");
    });
  }
  
  // Add event listener to download button
  document.getElementById('download-btn').addEventListener('click', handleDownloadClick);

  fetchExpenses();
});