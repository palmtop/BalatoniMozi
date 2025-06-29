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

// Example: Get details for the movie Inception (TMDb ID: 27205)
getMovieDetails(27205);