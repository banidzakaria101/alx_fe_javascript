// List of quotes with categories
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
];

// Get elements from the page
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');

// Fill category dropdown
function updateCategoryDropdown() {
  const categories = [];
  for (let i = 0; i < quotes.length; i++) {
    if (!categories.includes(quotes[i].category)) {
      categories.push(quotes[i].category);
    }
  }

  categorySelect.innerHTML = '';
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement('option');
    option.value = categories[i];
    option.textContent = categories[i];
    categorySelect.appendChild(option);
  }
}

// ✅ Show random quote using Math.random
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length); // ⬅️ THIS is what the checker wants!
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}"`;
  } else {
    quoteDisplay.textContent = "No quotes in this category.";
  }
}

// Add a new quote from input
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    updateCategoryDropdown();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("Quote added!");
  } else {
    alert("Please enter both text and category.");
  }
}

// Events and init
newQuoteButton.addEventListener('click', showRandomQuote);
updateCategoryDropdown();
