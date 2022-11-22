function embedQuote(quote, author)
{
    var wholeness = quote + "    - " + author;
    document.getElementById('quote').innerHTML = wholeness;
}

function fetchQuotes()
{
    fetch("https://api.quotable.io/random")
    .then((response) => response.json())
    .then((quote) => embedQuote(quote.content, quote.author));
}

fetchQuotes()