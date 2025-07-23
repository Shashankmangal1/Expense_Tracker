// Select DOM elements
const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Load transactions from localStorage or initialize empty
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Generate unique ID
function generateID() {
  return Date.now();
}

// Add transaction to array and DOM
function addTransaction(e) {
  e.preventDefault();

  const textVal = text.value.trim();
  const amountVal = amount.value.trim();

  if (textVal === "" || amountVal === "") {
    alert("Please enter both a description and an amount.");
    return;
  }

  const transaction = {
    id: generateID(),
    text: textVal,
    amount: +amountVal,
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransaction(transaction);
  updateTotals();

  text.value = "";
  amount.value = "";
}

// Render one transaction in DOM
function renderTransaction(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.dataset.id = transaction.id;

  item.innerHTML = `
    ${transaction.text}
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" aria-label="Delete transaction">❌</button>
  `;

  list.appendChild(item);
}

// Update balance, income and expense
function updateTotals() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = (
    amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.textContent = `₹${total}`;
  moneyPlus.textContent = `₹${income}`;
  moneyMinus.textContent = `₹${expense}`;
}

// Delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize: render all
function init() {
  list.innerHTML = "";
  transactions.forEach(renderTransaction);
  updateTotals();
}

// Event Listeners
form.addEventListener("submit", addTransaction);

// Event delegation for delete button
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const id = Number(li.dataset.id);
    deleteTransaction(id);
  }
});

// First load
init();
