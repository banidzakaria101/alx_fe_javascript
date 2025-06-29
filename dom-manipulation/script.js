let quotes = [];
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 30000; // 30 seconds

// —————————— Core Local Storage & Session Storage ——————————

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { id: 1, text: "The best way to predict the future is to create it.", category: "Motivation" },
      { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { id:3,text: "You only live once, but if you do it right, once is enough.", category: "Life" }

    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastQuote(quoteText) {
  sessionStorage.setItem("lastQuote", quoteText);
}

function loadLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    document.getElementById("quoteDisplay").textContent = `"${last}"`;
  }
}

// —————————— Display & Add Quotes ——————————

function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect").value;
  const filtered = quotes.filter(q => q.category === selectedCategory);
  if (filtered.length) {
    const idx = Math.floor(Math.random() * filtered.length);
    const text = filtered[idx].text;
    document.getElementById("quoteDisplay").textContent = `"${text}"`;
    saveLastQuote(text);
  } else {
    document.getElementById("quoteDisplay").textContent = "No quotes.";
  }
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    const newId = Date.now();
    quotes.push({ id: newId, text, category });
    saveQuotes();
    populateCategories();
    updateCategoryDropdown();
    alert("Quote added!");
    // Optionally, send to server:
    syncToServer([{ id: newId, text, category }]);
  } else alert("Fill both fields.");
}

// —————————— Forms & Filtering ——————————

function createAddQuoteForm() {
  const formDiv = document.getElementById("formContainer");
  const inputs = [
    { id: "newQuoteText", placeholder: "Enter a new quote" },
    { id: "newQuoteCategory", placeholder: "Enter category" }
  ];

  formDiv.innerHTML = "<h3>Add a New Quote</h3>";
  inputs.forEach(i => {
    const el = document.createElement("input");
    el.id = i.id; el.type = "text"; el.placeholder = i.placeholder;
    formDiv.appendChild(el);
    formDiv.appendChild(document.createElement("br"));
  });

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.onclick = addQuote;
  formDiv.appendChild(btn);
}

function updateCategoryDropdown() {
  const cats = [...new Set(quotes.map(q => q.category))];
  const sel = document.getElementById("categorySelect");
  sel.innerHTML = "";
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}

function populateCategories() {
  const cats = [...new Set(quotes.map(q => q.category))];
  const selF = document.getElementById("categoryFilter");
  selF.innerHTML = `<option value="all">All Categories</option>`;
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    selF.appendChild(opt);
  });
  const last = localStorage.getItem("lastCategoryFilter");
  if (last && selF.querySelector(`option[value="${last}"]`)) {
    selF.value = last;
    filterQuotes();
  }
}

function filterQuotes() {
  const sel = document.getElementById("categoryFilter");
  const val = sel.value;
  localStorage.setItem("lastCategoryFilter", val);
  const arr = val === "all" ? quotes : quotes.filter(q => q.category === val);
  const disp = arr.map(q => `• "${q.text}"`).join("<br><br>") || "No quotes found.";
  document.getElementById("quoteDisplay").innerHTML = disp;
}

// —————————— Server Sync & Conflict Handling ——————————

async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  return data.map(item => ({
    id: item.id,
    text: item.body || item.title || "",
    category: "Server"
  }));
}

function syncFromServer() {
  fetchFromServer()
    .then(serverQuotes => {
      const localIds = quotes.map(q => q.id);
      let changed = false;

      serverQuotes.forEach(sq => {
        const local = quotes.find(q => q.id === sq.id);
        if (!local) {
          quotes.push(sq);
          changed = true;
        } else if (local.text !== sq.text || local.category !== sq.category) {
          quotes = quotes.map(q => q.id === sq.id ? sq : q);
          changed = true;
        }
      });

      if (changed) {
        saveQuotes();
        populateCategories();
        updateCategoryDropdown();
        document.getElementById("syncStatus").textContent = "✳️ Data updated from server";
      }
    })
    .catch(_=> document.getElementById("syncStatus").textContent = "⚠️ Sync failed");
}

function syncToServer(newItems) {
  newItems.forEach(item => {
    fetch(SERVER_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(item)
    });
  });
}

function startSync() {
  syncFromServer();
  setInterval(syncFromServer, SYNC_INTERVAL);
}

// —————————— Initialization ——————————

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
loadQuotes();
populateCategories();
updateCategoryDropdown();
createAddQuoteForm();
loadLastQuote();

if (document.getElementById("categoryFilter")) {
  document.getElementById("categoryFilter").onchange = filterQuotes;
}
startSync();
