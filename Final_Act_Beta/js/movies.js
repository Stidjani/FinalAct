// fetch movie data from the backend
fetch('http://localhost:3000/movies')
  .then(response => response.json()) // parse the response as JSON
  .then(movies => {
    const moviesGrid = document.querySelector('.prev-movies-grid'); // find the grid where movies will be displayed

    // get saved movies from localStorage, or initialize an empty array if none are saved
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    // get watched movies from localStorage, or initialize an empty array if none are saved
    let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];

    // loop through each movie
    movies.forEach(movie => {

      // check if the movie is already saved by comparing IDs
      const isSaved = savedMovies.some(saved => saved.id === movie.id);
      const isWatched = watchedMovies.some(watched => watched.id === movie.id);

      // create a new div element for the movie card
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card'); // add the class for styling

      movieCard.innerHTML = `
        <img src="${movie.image}" alt="Movie Poster" class="poster"> 
        <div class="movie-info">
          <h3 class="title">${movie.title}</h3>
          <p class="description scroll-box">${movie.description}</p> <!-- Added scroll-box class -->

          <p class="details">
            <strong>RATING:</strong> ${movie.rating} <br>
            <!-- this is just a placeholder for year and time, you might want to change it -->
          </p>
          <button class="action-button save-btn"
            onclick="saveForLater(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.image}', '${movie.description.replace(/'/g, "\\'")}', '${movie.rating}', this)">
            ${isSaved ? "Saved" : "Save for Later"} <!-- show 'Saved' if already saved, otherwise show 'Save for Later' -->
          </button>

          <button class="action-button watch-btn"
            onclick="addToWatched(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.image}', '${movie.description.replace(/'/g, "\\'")}', '${movie.rating}', this)">
            ${isWatched ? "Added" : "Add to Watched"}
          </button>
        </div>
      `;
      // append the new movie card to the grid
      moviesGrid.appendChild(movieCard);
    });
  })
  .catch(error => console.error('Error fetching movies:', error)); // catch any errors from fetching

// function to save a movie for later
function saveForLater(id, title, image, description, rating, button) {
  let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

  // check if the movie is already in the saved list
  if (!savedMovies.some(movie => movie.id === id)) {
    savedMovies.push({ id, title, image, description, rating }); // add the movie to the saved list
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));

    // update the button text to saved and disable it
    button.textContent = "Saved";
    button.disabled = true;
    button.classList.add("saved");
  }
}

// function to add a movie to the watched list
function addToWatched(id, title, image, description, rating, button) {
  let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];

  // check if the movie is already in the watched list
  if (!watchedMovies.some(movie => movie.id === id)) {
    watchedMovies.push({ id, title, image, description, rating }); // add the movie to the watched list
    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));

    // update the button text to added and disable it
    button.textContent = "Added";
    button.disabled = true;
    button.classList.add("watched");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mood = urlParams.get('mood');

  if (mood) {
    // Capitalize first letter
    const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);

    // Update heading
    const heading = document.getElementById('moviesHeading');
    if (heading) {
      heading.textContent = `${moodCapitalized} Movies`;
    }

    // Fetch filtered movies
    fetch(`/filter-movies?mood=${mood}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        displayMovies(data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        const container = document.getElementById('moviesContainer');
        container.innerHTML = '<p>Sorry, something went wrong.</p>';
      });
  }
});


// Movie display function
function displayMovies(movies) {
  const container = document.getElementById('moviesContainer'); //
  container.innerHTML = ''; // clear previous results

  if (!movies || movies.length === 0) {
    container.innerHTML = '<p>No movies found for this mood.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    movieCard.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" class="poster">
      <div class="movie-info">
        <h3 class="title">${movie.title}</h3>
        <p class="description scroll-box">${movie.description}</p>
        <p class="details"><strong>RATING:</strong> ${movie.rating}</p>
        <button class="action-button save-btn"
          onclick="saveForLater(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.image}', '${movie.description.replace(/'/g, "\\'")}', '${movie.rating}', this)">
          Save for Later
        </button>
        <button class="action-button watch-btn"
          onclick="addToWatched(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.image}', '${movie.description.replace(/'/g, "\\'")}', '${movie.rating}', this)">
          Add to Watched
        </button>
      </div>
    `;

    container.appendChild(movieCard);
  });
}


