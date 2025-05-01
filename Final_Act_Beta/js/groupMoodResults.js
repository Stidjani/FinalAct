// waits for the page content to load before running the script
document.addEventListener('DOMContentLoaded', () => {
  // gets URL parameters to extract the 'mood' value
  const urlParams = new URLSearchParams(window.location.search);
  const moodParam = urlParams.get('mood');

  // if no 'mood' parameter is found, display a message and stop further execution
  if (!moodParam) {
    document.body.innerHTML = "<h2>No moods selected.</h2>";
    return;
  }

  // find the heading element and update it to reflect the selected mood
  const heading = document.getElementById('moviesHeading');
  if (heading) {
    // capitalize the mood and display it as part of the heading
    heading.textContent = `${moodParam.charAt(0).toUpperCase() + moodParam.slice(1).toUpperCase()} Movies`;
  }

  // make an API request to fetch movies based on the selected mood
  fetch(`/filter-movies?mood=${encodeURIComponent(moodParam)}`)
    .then(res => {
      // if the response is not ok, throw an error
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json(); // parse the response as JSON
    })
    .then(movies => {
      // call the function to display the movies once they are fetched
      displayMovies(movies);
    })
    .catch(err => {
      // if there is an error, log it and display a message to the user
      console.error(err);
      const container = document.getElementById('moviesContainer');
      container.innerHTML = '<p>Sorry, something went wrong loading movies.</p>';
    });
});

// function to render movies with options to save or mark as watched
function displayMovies(movies) {
  const container = document.getElementById('moviesContainer');
  container.innerHTML = ''; // clear old content

  // if no movies are found, display a message
  if (!movies || movies.length === 0) {
    container.innerHTML = '<p>No movies found for this mood.</p>';
    return;
  }

  // get saved and watched movies from localStorage, or set to empty arrays if none exist
  const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
  const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];

  // loop through each movie to create the HTML structure
  movies.forEach(movie => {
    const isSaved = savedMovies.some(m => m.id === movie.id); // check if movie is saved
    const isWatched = watchedMovies.some(m => m.id === movie.id); // check if movie is watched

    // create a new movie card element
    const card = document.createElement('div');
    card.className = 'movie-card';

    // populate the card with movie details and action buttons
    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" class="poster">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p class="description scroll-box">${movie.description}</p>
        <p><strong>Rating:</strong> ${movie.rating}</p>
        <button class="action-button save-btn"
          onclick="saveForLater(${movie.id}, '${escapeQuotes(movie.title)}', '${movie.image}', '${escapeQuotes(movie.description)}', '${movie.rating}', this)">
          ${isSaved ? 'Saved' : 'Save for Later'}
        </button>
        <button class="action-button watch-btn"
          onclick="addToWatched(${movie.id}, '${escapeQuotes(movie.title)}', '${movie.image}', '${escapeQuotes(movie.description)}', '${movie.rating}', this)">
          ${isWatched ? 'Added' : 'Add to Watched'}
        </button>
      </div>
    `;

    // append the movie card to the container
    container.appendChild(card);
  });
}

// function to save a movie for later in localStorage
function saveForLater(id, title, image, description, rating, btn) {
  let saved = JSON.parse(localStorage.getItem('savedMovies')) || [];
  // if the movie is not already saved, add it
  if (!saved.some(m => m.id === id)) {
    saved.push({ id, title, image, description, rating });
    localStorage.setItem('savedMovies', JSON.stringify(saved)); // update localStorage
    btn.textContent = "Saved"; // update button text
    btn.disabled = true; // disable the button
    btn.classList.add('saved'); // add a 'saved' class for styling
  }
}

// function to add a movie to the watched list in localStorage
function addToWatched(id, title, image, description, rating, btn) {
  let watched = JSON.parse(localStorage.getItem('watchedMovies')) || [];
  // if the movie is not already watched, add it
  if (!watched.some(m => m.id === id)) {
    watched.push({ id, title, image, description, rating });
    localStorage.setItem('watchedMovies', JSON.stringify(watched)); // update localStorage
    btn.textContent = "Added"; // update button text
    btn.disabled = true; // disable the button
    btn.classList.add('watched'); // add a 'watched' class for styling
  }
}

// function to escape single quotes in movie title or description to avoid issues with HTML attributes
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'"); // escape single quotes by replacing them with an escaped version
}
