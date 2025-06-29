import { Database } from 'sqlite3';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) {
  throw new Error('TMDB_API_KEY is not defined in the .env file');
}

const tmdb = new TMDB(apiKey);

export async function getMovieNamesFromDb(db: Database): Promise<string[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT title FROM movies', (err, rows: { title: string }[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(row => row.title));
      }
    });
  });
}

export async function searchMovieOnTMDB(movieName: string) {
  try {
    const response = await tmdb.search.movies(movieName);
    return response.results; // Returns an array of movie results
  } catch (error) {
    console.error(`Error searching for movie "${movieName}" on TMDb:`, error);
    return [];
  }
}