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
