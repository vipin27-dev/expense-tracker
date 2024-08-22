document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.querySelector("#expense-form");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to be logged in to view your expenses.");
    window.location.href = '/'; 
    return;
  }

  axios
    .get("http://localhost:4000/api/add-expense", { 
      headers: {
         Authorization: `Bearer ${token}` } })
    .then((response) => {
      const expenses = response.data;
      expenses.forEach((expense) => {
        addExpenseToUI(expense);
      });
    })
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      alert("An error occurred while fetching expenses.");
    });

  if (expenseForm) {
    expenseForm.addEventListener("submit", handleFormSubmit);
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

    const expense = {
      amount,
      description,
      type,
    };

    axios
    .post("http://localhost:4000/api/add-expense", expense, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        addExpenseToUI(response.data);
        expenseForm.reset(); 
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
        alert("An error occurred while adding the expense.");
      });
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
      axios
         .delete(`http://localhost:4000/api/add-expense/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          li.remove();
        })
        .catch((err) => {
          console.error("Error deleting expense:", err);
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

        axios
          .put(`http://localhost:4000/api/add-expense/${expense.id}`, updatedExpense, { headers: { Authorization: `Bearer ${token}` } })
          .then(() => {
            li.innerHTML = `${updatedExpense.amount} - ${updatedExpense.description} - ${updatedExpense.type}`;
            li.appendChild(createDeleteButton(expense.id, li));
            li.appendChild(createEditButton(updatedExpense, li));
          })
          .catch((err) => {
            console.error("Error updating expense:", err);
            alert("An error occurred while updating the expense.");
          });
      };

      li.replaceWith(editForm);
    };
    return editBtn;
  }
});
