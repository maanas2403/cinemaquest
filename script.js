const apiKey = '1ffd7b3687d86736a4388cff1233050b';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';
const genreMapping = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

// Call createGenreMapping function when the page loads
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    const searchIcon = document.getElementById('searchIcon');
    if (searchBar.style.display === 'none') {
        searchBar.style.display = 'block';
        searchIcon.style.display = 'none';
    } else {
        searchBar.style.display = 'none';
    }
}
async function fetchTopMovies2024(year) {
    try {
        const response = await fetch(`${apiUrl}/discover/movie?api_key=${apiKey}&primary_release_year=${year}&sort_by=vote_count.desc`);
        const data = await response.json();
        // Calculate the product of vote_average and vote_count for each movie
        const sortedMovies = data.results
            .map(movie => ({
                ...movie,
                voteProduct: movie.vote_average * movie.vote_count
            }))
            .sort((a, b) => b.voteProduct - a.voteProduct)
            .slice(0, 25); // Get top 10 movies
        return sortedMovies;
    } catch (error) {
        console.error('Error fetching top movies of 2024:', error);
        return [];
    }
}
// Display top movies in a category
async function displayTopMovies(year, category) {
    const movies = await fetchTopMovies2024(year);
    const container = document.getElementById(category);
    container.innerHTML = ''; // Clear previous content

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const poster = document.createElement('img');
        poster.src = imageBaseUrl + movie.poster_path;
        poster.alt = movie.title;
        poster.addEventListener('click', () => {
            openModal(movie);
        });

        // Append poster to movie div
        movieDiv.appendChild(poster);

        const title = document.createElement('p');
        title.textContent = movie.title;

        // Append title to movie div
        movieDiv.appendChild(title);

        // Append movie div to container
        container.appendChild(movieDiv);
    });
}

function displaySearchResults(results, query) {
    const searchResultsContainer = document.getElementById('searchResults');
    const searchResultsInnerContainer = document.getElementById('searchResultsInner');
    searchResultsContainer.innerHTML = ''; // Clear previous content

    // Add search results heading
    const heading = document.createElement('h2');
    heading.classList.add('search-results-heading');
    heading.textContent = `Search Results for: "${query}"`;
    searchResultsContainer.appendChild(heading);

    // Display search results
    results.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const poster = document.createElement('img');
        poster.src = imageBaseUrl + movie.poster_path;
        poster.alt = movie.title;
        poster.addEventListener('click', () => {
            openModal(movie);
        });
        const title = document.createElement('p');
        title.textContent = movie.title;

        movieDiv.appendChild(poster);
        movieDiv.appendChild(title);

        searchResultsInnerContainer.appendChild(movieDiv);
        searchResultsContainer.appendChild(searchResultsInnerContainer);
    });
}
function handleMouseHover() {
    const movies = document.querySelectorAll('.movie');
    movies.forEach(movie => {
        movie.addEventListener('mouseenter', () => {
            movie.style.transform = 'translateX(10px)';
        });
        movie.addEventListener('mouseleave', () => {
            movie.style.transform = 'translateX(0)';
        });
    });
}
// Display top movies in a category
async function displayTopMoviesFrom2000To2018() {
    for (let year = 1915; year <= 2024; year++) {
        await displayTopMovies(year.toString(), year.toString());
    }
}
// Load top movies when the page loads
window.onload = function () {
    displayTopMoviesFrom2000To2018()
};

// Function to search movies
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();

        if (data.results.length === 0) {
            alert('No movies found.');
            return;
        }

        // Hide top movies sections
        document.querySelectorAll('.top-movies').forEach(section => {
            section.style.display = 'none';
        });

        // Show search results container
        let searchResultsContainer = document.getElementById('searchResultsInner');
        if (!searchResultsContainer) {
            searchResultsContainer = document.createElement('div');
            searchResultsContainer.id = 'searchResultsInner';
            document.body.appendChild(searchResultsContainer);
        }
        searchResultsContainer.innerHTML = '';
        // Display search results
        displaySearchResults(data.results, query);
        handleMouseHover(); // Apply mouse hover effect to search results
    } catch (error) {
        console.error('Error searching movies:', error);
        alert('An error occurred while searching movies.');
    }
}
function goToMovieCenter() {
    window.location.href = 'index.html';
}

async function openModal(movie) {
    const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
console.log(movie);

// Clear previous content
modalContent.innerHTML = '';
try{
const response = await fetch(`${apiUrl}/movie/${movie.id}/credits?api_key=${apiKey}`);
const data = await response.json();
const cast = data.cast.slice(0, 10);;

// Create a container for poster and details
const container = document.createElement('div');
container.classList.add('movie-details-container');

// Create an element for the poster
const poster = document.createElement('img');
poster.src = imageBaseUrl + movie.poster_path;
poster.alt = movie.title;

// Append the poster to the container
container.appendChild(poster);

// Create a container for movie details
const detailsContainer = document.createElement('div');
detailsContainer.classList.add('movie-details');

// Create elements to display movie details
const title = document.createElement('h2');
title.textContent = movie.title;

const releaseDate = document.createElement('p');
releaseDate.textContent = `Release Date: ${movie.release_date}`;

const genreIds = movie.genre_ids.map(genreId => genreMapping[genreId]);
const genres = document.createElement('p');
genres.textContent = `Genres: ${genreIds.join(', ')}`;

const castList = document.createElement('p');
castList.textContent = `Cast: ${cast.map(actor => actor.name).join(', ')}`;

const overview = document.createElement('p');
overview.textContent = `Overview: ${movie.overview}`;

const rating = document.createElement('p');
rating.textContent = `Rating: ${movie.vote_average}`;

const popularity = document.createElement('p');
popularity.textContent = `Popularity: ${movie.popularity}`;

const votes = document.createElement('p');
votes.textContent = `No of Votes: ${movie.vote_count}`;

// Append movie details to the details container
detailsContainer.appendChild(title);
detailsContainer.appendChild(releaseDate);
detailsContainer.appendChild(genres);
detailsContainer.appendChild(castList);
detailsContainer.appendChild(overview);
detailsContainer.appendChild(rating);
detailsContainer.appendChild(popularity);
detailsContainer.appendChild(votes);
// Append the details container to the main container
container.appendChild(detailsContainer);

// Append the main container to the modal content
modalContent.appendChild(container);

// Display modal
modal.style.display = 'block';
} catch (error) {
    console.error('Error fetching cast:', error);
}
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}