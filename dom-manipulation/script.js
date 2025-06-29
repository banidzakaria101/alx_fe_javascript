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

function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect").value;
  const filtered = quotes.filter(q => q.category === selectedCategory);
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex].text;
    document.getElementById("quoteDisplay").textContent = `"${quote}"`;
    saveLastQuote(quote); 
  } else {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
  }
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text: text, category: category });
    saveQuotes();
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
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    updateCategoryDropdown();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
loadQuotes();
updateCategoryDropdown();
createAddQuoteForm();
loadLastQuote(); 
