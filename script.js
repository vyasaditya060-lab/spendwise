const SAMPLE = [
  {
    id:1,
    name:'Mess Fee',
    amount:3200,
    cat:'Food',
    date:'2025-05-01',
    type:'expense'
  },
  {
    id:2,
    name:'Part-time stipend',
    amount:5000,
    cat:'Other',
    date:'2025-05-02',
    type:'income'
  }
];

let expenses =
  JSON.parse(localStorage.getItem('sw_expenses')) || SAMPLE;

let nextId =
  Math.max(...expenses.map(e => e.id)) + 1;

function save() {
  localStorage.setItem(
    'sw_expenses',
    JSON.stringify(expenses)
  );
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function totals() {

  const income = expenses
    .filter(e => e.type === 'income')
    .reduce((s,e) => s + e.amount, 0);

  const expense = expenses
    .filter(e => e.type === 'expense')
    .reduce((s,e) => s + e.amount, 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

let currentPage = 'dashboard';

function showPage(page) {

  currentPage = page;

  document.querySelectorAll('.nav-item')
    .forEach(btn => btn.classList.remove('active'));

  renderPage();
}

function renderPage() {

  const main =
    document.getElementById('mainContent');

  if(currentPage === 'dashboard') {
    main.innerHTML = dashboardHTML();
  }

  if(currentPage === 'expenses') {
    main.innerHTML = expensesHTML();
  }

  if(currentPage === 'analytics') {
    main.innerHTML = analyticsHTML();
    renderCharts();
  }
}

/* DASHBOARD */

function dashboardHTML() {

  const t = totals();

  return `
    <div class="page-header">

      <div>
        <div class="page-title">Dashboard</div>
      </div>

      <button class="add-btn" onclick="openModal()">
        Add Entry
      </button>

    </div>

    <div class="summary-grid">

      <div class="stat-card">
        <div>Balance</div>
        <div class="stat-value">${fmt(t.balance)}</div>
      </div>

      <div class="stat-card">
        <div>Income</div>
        <div class="stat-value">${fmt(t.income)}</div>
      </div>

      <div class="stat-card">
        <div>Expenses</div>
        <div class="stat-value">${fmt(t.expense)}</div>
      </div>

    </div>

    <div class="card">

      <h3>Recent Transactions</h3>

      ${expenses.map(e => `
        <div class="tx-item">

          <div>
            <strong>${e.name}</strong>
            <div>${e.cat}</div>
          </div>

          <div class="tx-amount ${e.type === 'income' ? 'pos' : 'neg'}">
            ${e.type === 'income' ? '+' : '-'}${fmt(e.amount)}
          </div>

        </div>
      `).join('')}

    </div>
  `;
}

/* EXPENSES PAGE */

function expensesHTML() {

  return `
    <div class="page-header">

      <div class="page-title">All Transactions</div>

      <button class="add-btn" onclick="openModal()">
        Add Entry
      </button>

    </div>

    <div class="card">

      ${expenses.map(e => `
        <div class="tx-item">

          <div>
            <strong>${e.name}</strong>
            <div>${e.cat}</div>
          </div>

          <div class="tx-amount ${e.type === 'income' ? 'pos' : 'neg'}">
            ${e.type === 'income' ? '+' : '-'}${fmt(e.amount)}
          </div>

        </div>
      `).join('')}

    </div>
  `;
}

/* ANALYTICS */

function analyticsHTML() {

  return `
    <div class="page-header">
      <div class="page-title">Analytics</div>
    </div>

    <div class="card">
      <canvas id="chart"></canvas>
    </div>
  `;
}

function renderCharts() {

  const ctx = document.getElementById('chart');

  if(!ctx) return;

  const expenseData =
    expenses.filter(e => e.type === 'expense');

  new Chart(ctx, {

    type:'bar',

    data: {

      labels: expenseData.map(e => e.name),

      datasets:[{
        label:'Expenses',
        data: expenseData.map(e => e.amount)
      }]
    }
  });
}

/* MODAL */

function openModal() {

  document
    .getElementById('modalOverlay')
    .classList.add('open');

  document.getElementById('expDate').value =
    new Date().toISOString().split('T')[0];
}

function closeModal() {

  document
    .getElementById('modalOverlay')
    .classList.remove('open');
}

function addExpense() {

  const name =
    document.getElementById('expName').value;

  const amount =
    parseFloat(document.getElementById('expAmount').value);

  const cat =
    document.getElementById('expCat').value;

  const date =
    document.getElementById('expDate').value;

  const type =
    document.getElementById('expType').value;

  if(!name || !amount || !date) {
    alert('Please fill all fields');
    return;
  }

  expenses.unshift({
    id: nextId++,
    name,
    amount,
    cat,
    date,
    type
  });

  save();

  closeModal();

  renderPage();
}

/* INIT */

renderPage();
