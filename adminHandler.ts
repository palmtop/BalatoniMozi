import { Database } from 'sqlite3';
import { Request, Response } from 'express';

interface MovieScheduleEntry {
  title: string;
  tmdb_id?: number; // tmdb_id is optional as it might not be present
}

export async function adminHandler(req: Request, res: Response, db: Database) {
  try {
    debugger;
    const movies = await getMoviesFromSchedule(db);
    res.render('admin', { movies });
  } catch (err) {
    console.error('Error fetching movie schedule:', err);
    res.status(500).send('Error loading admin page');
  }
}

async function getMoviesFromSchedule(db: Database): Promise<MovieScheduleEntry[]> {
  return new Promise((resolve, reject) => {
    const query = 'SELECT ms.movie, m.tmdb_id FROM movie_schedule ms LEFT JOIN movies m ON ms.movie = m.name GROUP BY ms.movie';


    db.all(query, [], (err, rows: MovieScheduleEntry[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  })
};