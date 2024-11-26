async function searchBooks() {
    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    try {
        const response = await fetch(`/api/books?query=${encodeURIComponent(query)}`);
        const books = await response.json();

        if (books.length === 0) {
            resultsDiv.innerHTML = "No books found.";
            return;
        }

        books.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.className = "book";
            bookDiv.innerHTML = `
                <h3>${book.volumeInfo.title}</h3>
                <p>Authors: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "N/A"}</p>
                <button onclick="showReviewForm('${book.id}')">Submit Review</button>
            `;
            resultsDiv.appendChild(bookDiv);
        });
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = "An error occurred while fetching books.";
    }
}

function showReviewForm(bookId) {
    document.getElementById("reviewForm").style.display = "block";
    document.getElementById("reviewForm").setAttribute('data-book-id', bookId);
}

async function submitReview() {
    const reviewText = document.getElementById("reviewText").value;
    const rating = document.getElementById("rating").value;
    const bookId = document.getElementById("reviewForm").getAttribute('data-book-id');
    
    if (!reviewText || !rating) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId, reviewText, rating })
        });

        const result = await response.json();
        alert(result.message || "Review submitted successfully!");
        document.getElementById("reviewForm").reset();
    } catch (error) {
        console.error(error);
        alert("Error submitting review.");
    }
}
