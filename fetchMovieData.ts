import { TMDB, Movie } from 'tmdb-ts';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.TMDB_API_KEY;
const tmdb = new TMDB(apiKey);
const genreMap: { [key: number]: string } = {};

export interface extMovie extends Movie {
  genreStr: string;
}

export function init() {
  getGenreList();
}


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

    const movies = await tmdb.search.movies({ "query": query, "language": "hu-HU" });
    return movies.results;
  } catch (error) {
    console.error('Error searching for movies:', error);
  }
}

async function getGenreList() {
  try {
    const genres = await tmdb.genres.movies({ "language": "hu-HU" });
    genres.genres.forEach(genre => {
      genreMap[genre.id] = genre.name;
    });
    return genreMap;
  } catch (error) {
    console.error('Error fetching genre list:', error);
    return {};
  }
}


export function getGenreNames(genreIds: number[]): string {
  //concatenate genre names using , as separator
  if (!genreIds) return "";

  return genreIds.map(id => genreMap[id]).join(", ");
}


// Example: Search for movies with the title "Inception"
searchMovie("Így neveld a sárkányodat");


// Example: Get details for the movie Inception (TMDb ID: 27205)
//getMovieDetails(27205);