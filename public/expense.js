let currentPage = 1; // Initialize current page
const limit = 10; // Set the number of items per page

document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.querySelector("#expense-form");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in to view your expenses.");
    window.location.href = '/'; 
    return;
  }

  const filterDropdown = document.querySelector("#filter-expensetype");

  // Initial fetch and display of expenses
  fetchAndDisplayExpenses();

  if (expenseForm) {
    expenseForm.addEventListener("submit", handleFormSubmit);
  }

  if (filterDropdown) {
    filterDropdown.addEventListener("change", handleFilterChange);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const amount = document.querySelector("#exampleFormControlInput1").value;
    const description = document.querySelector("#DescriptionText").value;
    const type = document.querySelector("#expensetype").value;

    if (!amount || !description || type === "Open this select menu") {
      alert("Please fill all fields and select a valid expense type.");
      return;
    }

    const expense = { amount, description, type };

    axios.post("http://localhost:4000/api/add-expense", expense, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      addExpenseToUI(response.data);
      expenseForm.reset();
    })
    .catch((error) => {
      console.error("Error adding expense:", error.response ? error.response.data : error.message);
      alert("An error occurred while adding the expense.");
    });
  }

  function fetchAndDisplayExpenses(page = currentPage) {
    axios.get(`http://localhost:4000/api/add-expense?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const { expenses, totalPages } = response.data;
      if (totalPages === undefined) {
        console.error("Total pages are undefined");
        return;
      }

      const selectedType = filterDropdown.value;
      const filteredExpenses = selectedType === "All"
        ? expenses
        : expenses.filter((expense) => expense.type === selectedType);

      document.getElementById("ul").innerHTML = "";
      filteredExpenses.forEach((expense) => addExpenseToUI(expense));

      setupPagination(page, totalPages);
    })
    .catch((error) => {
      console.error("Error fetching expenses:", error.response ? error.response.data : error.message);
      alert("An error occurred while fetching expenses.");
    });
  }

  function setupPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById("pagination");

    paginationContainer.innerHTML = "";

    if (totalPages > 1) {
      if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.addEventListener("click", () => {
          currentPage--;
          fetchAndDisplayExpenses(currentPage);
        });
        paginationContainer.appendChild(prevButton);
      }

      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.disabled = i === currentPage;
        pageButton.addEventListener("click", () => {
          currentPage = i;
          fetchAndDisplayExpenses(currentPage);
        });
        paginationContainer.appendChild(pageButton);
      }

      if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.addEventListener("click", () => {
          currentPage++;
          fetchAndDisplayExpenses(currentPage);
        });
        paginationContainer.appendChild(nextButton);
      }
    }
  }

  function handleFilterChange() {
    currentPage = 1; // Reset to first page on filter change
    fetchAndDisplayExpenses();
  }

  function addExpenseToUI(expense) {
    const ul = document.getElementById("ul");
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `${expense.amount} - ${expense.description} - ${expense.type}`;

    const deleteBtn = createDeleteButton(expense.id, li);
    const editBtn = createEditButton(expense, li);

    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
    ul.appendChild(li);
  }

  function createDeleteButton(id, li) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
      axios.delete(`http://localhost:4000/api/add-expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        li.remove();
      })
      .catch((err) => {
        console.error("Error deleting expense:", err.response ? err.response.data : err.message);
        alert("An error occurred while deleting the expense.");
      });
    };
    return deleteBtn;
  }

  function createEditButton(expense, li) {
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-light";
    editBtn.innerText = "Edit";
    editBtn.onclick = function () {
      const editForm = document.createElement("form");

      editForm.innerHTML = `
        <input type="number" name="amount" value="${expense.amount}" required>
        <input type="text" name="description" value="${expense.description}" required>
        <select name="type" required>
          <option value="Movie" ${expense.type === "Movie" ? "selected" : ""}>Movie</option>
          <option value="Fuel" ${expense.type === "Fuel" ? "selected" : ""}>Fuel</option>
          <option value="Rent" ${expense.type === "Rent" ? "selected" : ""}>Rent</option>
          <option value="Gym" ${expense.type === "Gym" ? "selected" : ""}>Gym</option>
          <option value="Groceries" ${expense.type === "Groceries" ? "selected" : ""}>Groceries</option>
        </select>
        <button type="submit">Submit</button>
      `;

      editForm.onsubmit = function (e) {
        e.preventDefault();

        const updatedExpense = {
          amount: editForm.amount.value,
          description: editForm.description.value,
          type: editForm.type.value,
        };

        axios.put(`http://localhost:4000/api/add-expense/${expense.id}`, updatedExpense, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          li.innerHTML = `${updatedExpense.amount} - ${updatedExpense.description} - ${updatedExpense.type}`;
          li.appendChild(createDeleteButton(expense.id, li));
          li.appendChild(createEditButton(updatedExpense, li));
        })
        .catch((err) => {
          console.error("Error updating expense:", err.response ? err.response.data : err.message);
          alert("An error occurred while updating the expense.");
        });
      };

      li.replaceWith(editForm);
    };
    return editBtn;
  }
});