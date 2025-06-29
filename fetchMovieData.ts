import { TMDB } from 'tmdb-ts';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.TMDB_API_KEY;
const tmdb = new TMDB(apiKey);

// Use the 'details' method to fetch movie details by ID
async function getMovieDetails(movieId: number) {
  try {
    const movie = await tmdb.movies.details(movieId);
    console.log(`Movie Title: ${movie.title}`);
    console.log(`Release Date: ${movie.release_date}`);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}

export async function searchMovie(query: string) {
  try {

    const movies = await tmdb.search.movies({"query":query,"language":"hu-HU"});
    console.log(`Search results for "${query}":`);
    movies.results.forEach(movie => {
      console.log(`- ${movie.title} (${movie.release_date}) - ID: ${movie.id}`);
    });
    return movies.results;
  } catch (error) {
    console.error('Error searching for movies:', error);
  }
}

// Example: Search for movies with the title "Inception"
searchMovie("Így neveld a sárkányodat");


// Example: Get details for the movie Inception (TMDb ID: 27205)
//getMovieDetails(27205);