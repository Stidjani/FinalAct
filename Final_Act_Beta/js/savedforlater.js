document.addEventListener('DOMContentLoaded', function() {
    // get the grid where saved movies will be displayed
    const savedMoviesGrid = document.querySelector('.saved-movies-grid');
    // retrieve the saved movies from localStorage, if any, or start with an empty array
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    // Function to render the saved movies on the page
    function renderSavedMovies() {
        // clear the grid before adding new content (to avoid duplicate cards)
        savedMoviesGrid.innerHTML = ""; 
        // loop through each movie in the savedMovies array
        savedMovies.forEach(movie => {
            // create a new div to hold the movie card
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <!-- Movie poster image -->
                <img src="${movie.image}" alt="Movie Poster" class="poster">
                <div class="movie-info">
                    <!-- Movie title -->
                    <h3 class="title">${movie.title}</h3>
                    <!-- Movie description -->
                    <p class="description scroll-box">${movie.description}</p> <!-- Added scroll-box class -->
                    <p class="details">
                        <!-- Movie rating -->
                        <strong>RATING:</strong> ${movie.rating} <br>
                    </p>
                    <!-- Button to remove the movie from saved list -->
                    <button class="action-button remove-btn" onclick="removeFromSaved(${movie.id})">Remove</button>
                </div>
            `;
            // append the new movie card to the grid
            savedMoviesGrid.appendChild(movieCard);
        });
    }

    // initially render the saved movies when the page loads
    renderSavedMovies();

    // remove movie from saved
    window.removeFromSaved = function(id) {
        // filter out the movie that needs to be removed by matching the ID
        savedMovies = savedMovies.filter(movie => movie.id !== id);
        // update localStorage with the new list of saved movies
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        // re-render the saved movies without the removed one
        renderSavedMovies(); 
    };
    document.getElementById("group-prompt").addEventListener("click", () => {
        document.getElementById("popup").style.display = "flex";
    });

    document.querySelector(".popup-content .action-button").addEventListener("click", () => {
        savedMovies = []; // clear the saved movies array 
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies)); // update localStorage
        renderSavedMovies();
        document.getElementById("popup").style.display = "none";
    });
});
