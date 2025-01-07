document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    renderExpenses(); // Call render function on load
    updateTotal();

    // Submit form event listener
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();  // prevents form submission and page reload
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());

        // Validate inputs
        if (name !== "" && !isNaN(amount) && amount > 0) {
            const newExpense = {
                id: Date.now(),
                name: name,
                amount: amount
            };

            expenses.push(newExpense);
            saveExpensesToLocal();  // Save to local storage
            renderExpenses();       // Re-render expenses list
            updateTotal();          // Update total amount

            // Clear input fields after adding expense
            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        }
    });

    // Calculate the total expenses amount
    function calculateTotal() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    // Save expenses array to localStorage
    function saveExpensesToLocal() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Update the total amount display
    function updateTotal() {
        const totalAmount = calculateTotal();
        totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }

    // Render the list of expenses
    function renderExpenses() {
        expenseList.innerHTML = ""; // Clear current list
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="flex justify-between items-center bg-white p-2 rounded-md shadow">
                    <span class="flex-1">${expense.name} - $${expense.amount}</span>
                    <button class="bg-red-500 text-white p-1 rounded hover:bg-red-600" data-id="${expense.id}">Delete</button>
                </div>
            `;
            expenseList.appendChild(li);
        });
    }

    // Delete expense event listener
    expenseList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const expenseID = parseInt(e.target.getAttribute("data-id"));
            expenses = expenses.filter((expense) => expense.id !== expenseID);

            saveExpensesToLocal(); // Update localStorage
            renderExpenses();      // Re-render the list
            updateTotal();         // Update total amount
        }
    });
});
