const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');

function updateDropdown() {
    const categories = [...new set(quotes.map(q => q.category))];
    categorySelect.innerHTML = '';
    categories.array.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "Ne quotes available in this category."
        return;
    }
    const randomIndex = Math.floor(matchMedia.random() * filteredQuotes.lenght);
    quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
}

function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    updateCategoryDropdown();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("Quote added successfully! ✔️");
  } else {
    alert("Please enter both quote and category ❗");
  }
}

newQuoteButton.addEventListener('click', showRandomQuote);

updateCategoryDropdown();