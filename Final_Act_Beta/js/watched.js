document.addEventListener('DOMContentLoaded', function() {
    // get the grid where watched movies will be displayed
    const watchedMoviesGrid = document.querySelector('.watched-movies-grid');
    // retrieve the watched movies from localStorage, if any, or start with an empty array
    let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];

    // Function to render the watched movies on the page
    function renderWatchedMovies() {
        // clear the grid before adding new content (to avoid duplicate cards)
        watchedMoviesGrid.innerHTML = ""; 
        // loop through each movie in the watchedMovies array
        watchedMovies.forEach(movie => {
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
                    <!-- Button to remove the movie from watched list -->
                    <button class="action-button remove-btn" onclick="removeFromWatched(${movie.id})">Remove</button>
                </div>
            `;
            // append the new movie card to the grid
            watchedMoviesGrid.appendChild(movieCard);
        });
    }

    // initially render the watched movies when the page loads
    renderWatchedMovies();

    // remove movie from watched
    window.removeFromWatched = function(id) {
        // filter out the movie that needs to be removed by matching the ID
        watchedMovies = watchedMovies.filter(movie => movie.id !== id);
        // update localStorage with the new list of watched movies
        localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
        // re-render the watched movies without the removed one
        renderWatchedMovies(); 
    };

 document.getElementById("group-prompt").addEventListener("click", () => {
 document.getElementById("popup").style.display = "flex";
});

document.querySelector("#popup .action-button").addEventListener("click", () => {
    watchedMovies = [];
    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
    renderWatchedMovies();
    document.getElementById("popup").style.display = "none";
});
});
