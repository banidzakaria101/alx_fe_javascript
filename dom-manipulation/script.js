let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
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

function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect").value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length); 
    const randomQuote = filteredQuotes[randomIndex].text;
    document.getElementById("quoteDisplay").textContent = `"${randomQuote}"`;
    saveLastQuote(randomQuote); 
  } else {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
  }
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();        
    updateCategoryDropdown();   
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

function createAddQuoteForm() {
  const formDiv = document.getElementById("formContainer");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formDiv.appendChild(document.createElement("h3")).textContent = "Add a New Quote";
  formDiv.appendChild(textInput);
  formDiv.appendChild(document.createElement("br"));
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(document.createElement("br"));
  formDiv.appendChild(addButton);
}

function updateCategoryDropdown() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter && categoryFilter.querySelector(`option[value="${lastFilter}"]`)) {
    categoryFilter.value = lastFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selected);

  let result = "";
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    result = "No quotes found.";
  } else {
    result = filtered.map(q => `• "${q.text}"`).join("<br><br>");
  }

  document.getElementById("quoteDisplay").innerHTML = result;
}

function exportToJsonFile() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    updateCategoryDropdown();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
loadQuotes();
populateCategories();
updateCategoryDropdown();
createAddQuoteForm();
loadLastQuote(); 
