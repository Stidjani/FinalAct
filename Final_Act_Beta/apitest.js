require('dotenv').config();
console.log('TMDB API Key:', process.env.TMDB_ACCESS_TOKEN);

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // to parse JSON request bodies

function read() {
    return new Promise((resolve, reject) => {
        fs.readFile("data.json", "utf8", (err, data) => {  
            if (err) reject(err); // reject promise if there's an error
            resolve(JSON.parse(data)); // parse and return JSON data
        });
    });
}

function write(data, field, type) { //write function which takes a data value (intended use is ints representing the movie ids), a field (seen/saved), and a type (add/remove)
    read().then(info => {
        switch(type) {
            case "remove":
                if (field === "seen") { //if we want to remove from seen
                    const index = info.seen.indexOf(data); //find where the data we want to remove is
                    if (index > -1) { //if we find it
                        info.seen.splice(index, 1); //remove it
                    }
                } else if (field === "saved") {//if we want to remove from saved do the same thing
                    const index = info.saved.indexOf(data);
                    if (index>-1) {
                        info.saved.splice(index, 1); 
                    }
                }
                else{
                    //invalid field
                }
                break;
            case "add":
                if(field == "seen") { //if we want to add to seen
                                if(info.seen.includes(data)) { //check if its already in seen, there are no duplicate ids, so we shouldnt add an id twice
                                    //already in seen
                                } else { //if its not already in seen
                                    info.seen.push(data); //push it
                                }
                            } else if(field == "saved") { //same deal with saved
                                if(info.saved.includes(data)) {
                                    //already in seen
                                } else {
                                    info.saved.push(data);
                                }
                            } else{
                                //invalid field
                            }
                break;
        }

        fs.writeFile("data.json", JSON.stringify(info, null, 2), err => { //we must turn the info into a string and set data.json's contents to that.
            if (err) throw err; });
    }).catch(err => {
        console.error("Error reading data:", err);
    });
}


// set up the route for filtering movies based on mood
app.get('/filter-movies', async (req, res) => {
    // get the 'mood' query parameter from the request
    const moodQuery = req.query.mood;

    // log the received mood query for debugging
    console.log("Received mood query:", moodQuery);

    // check if the 'mood' query is missing, empty, or invalid
    if (!moodQuery || typeof moodQuery !== 'string' || !moodQuery.trim()) {
        // if invalid, respond with a 400 status and error message
        return res.status(400).json({ error: 'Mood query is required' });
    }

    // split the mood query into individual moods, trim whitespace, and convert to lowercase
    const moods = moodQuery.split(',').map(m => m.trim().toLowerCase());

    // map moods
    const genreMap = {
        happy: { genres: '35', keywords: ['satisfying', 'uplifting'] },        
        sad: { genres: '18', keywords: ['sad', 'emotional'] },                 
        thrilling: { genres: '53', keywords: ['thrilling', 'intense'] },        
        dramatic: { genres: '10752', keywords: ['romance', 'emotional'] },      
        adventurous: { genres: '12', keywords: ['journey', 'exploration'] },   
        brave: { genres: '99', keywords: ['courage', 'strength'] },            
        nostalgic: { genres: '10402', keywords: ['2000s', '90s'] },           
        spooky: { genres: '27', keywords: ['scary', 'haunting'] },              
        silly: { genres: '10751', keywords: ['funny', 'heartwarming'] },        
        romantic: { genres: '10749', keywords: ['love', 'romance'] },           
        hyped: { genres: '28', keywords: ['exciting', 'high-energy'] },         
        chill: { genres: '16', keywords: ['relaxing', 'peaceful'] },            
    };
    

    // read the seen movies data 
    let readData = await read(); // Seen movies
    let allMovies = []; // array to store the filtered movies

    try {
        // calculate the number of movies to retrieve for each mood
        const moviesPerMood = Math.floor(99 / moods.length);

        // loop through each mood and fetch corresponding movies
        for (const mood of moods) {
            // get the mood's genre and keywords from the genreMap
            const moodData = genreMap[mood];
            if (!moodData) continue; // skip if the mood is not defined in the genreMap

            const { genres, keywords } = moodData;

            // make an API request to The Movie Database (TMDB) to discover movies with the selected genre
            const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                params: {
                    api_key: process.env.TMDB_ACCESS_TOKEN, // TMDB API key
                    with_genres: genres, // filter by genre
                    sort_by: 'popularity.desc', // sort movies by popularity
                },
            });

            const results = response.data.results || []; // get the list of movies from the response

            let added = 0; // counter for how many movies have been added for this mood
            // loop through the results and add them to the allMovies array
            for (let i = 0; i < results.length && added < moviesPerMood; i++) {
                const movie = results[i];
                // ensure the movie hasn't been seen before and isn't already in the allMovies array
                if (!readData.seen.includes(movie.id) && !allMovies.find(m => m.id === movie.id)) {
                    // add the movie to the allMovies array
                    allMovies.push({
                        id: movie.id,
                        title: movie.title,
                        description: movie.overview,
                        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // create the image URL
                        rating: movie.vote_average, // movie rating
                        mood: mood, // associate the movie with the current mood
                    });
                    added++; // increment the added counter
                }
            }
        }

        // respond with the filtered list of movies
        res.json(allMovies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ error: error.message });
    }
});


app.get('/saved-movies', async (req, res) => {
    try {
        let readData = await read();
        res.json(readData.saved || []);
    } catch (error) {
        console.error("Error fetching saved movies:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log server URL
});
