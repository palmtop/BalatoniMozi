import * as express from "express";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import { adminHandler } from "./adminHandler";
import { searchMovie, getGenreNames, init, extMovie } from "./fetchMovieData";
import { fetchMovieById } from './fetchMovieData';

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 9002;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.use(express.json()); // Add this line to parse JSON request bodies
console.log(path.join(__dirname, 'public'));

app.get('/', (req, res) => {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayFormatted = formatDate(today);
  const twoWeeksLaterFormatted = formatDate(twoWeeksLater);

  type MovieRow = {
    date: string;
    theater: string;
    movie: string;
  };
  console.log(todayFormatted);
  console.log(twoWeeksLaterFormatted);

  const sql = `SELECT date, theater, movie FROM movie_schedule WHERE date BETWEEN ? AND ? ORDER BY date`;
  db.all(sql, [todayFormatted, twoWeeksLaterFormatted], (err, rows: MovieRow[]) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving movie schedule');
      return;
    }

    const moviesByDate: { [key: string]: { theater: string, movie: string }[] } = {};
    rows.forEach((row) => {
      if (!moviesByDate[row.date]) {
        moviesByDate[row.date] = [];
      }
      moviesByDate[row.date].push({ theater: row.theater, movie: row.movie });
    });
    res.render('index', { moviesByDate });
  });
});

app.get('/api', (req, res) => {
  console.log("Hello world");
  res.json({ "msg": "Hello world1" });
});

app.get('/movie/:movieName', (req, res) => {
  const movieName = req.params.movieName;
  const sql = `SELECT date, theater FROM movie_schedule WHERE movie = ? ORDER BY date`;

  type MovieScheduleRow = {
    date: string;
    theater: string;
  };

  db.all(sql, [movieName], (err, rows: MovieScheduleRow[]) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving movie schedule for the movie');
      return;
    }
    console.log(movieName, rows);
    res.render('movie', { movieName, schedule: rows });
  });
});

app.get('/admin', async (req, res) => {
  try {
    adminHandler(req, res, db);

  } catch (error) {
    console.error('Error in admin route:', error);
    res.status(500).send('An error occurred loading the admin page.');
  }
});

app.get('/fetchMovie/:movieId/:movieTitle', async (req, res) => {
  const movieId = req.params.movieId;
  const movieTitle = req.params.movieTitle;

  try {
    const results = await searchMovie(movieTitle);
    // add the genreStr to the results
    const movies : extMovie[] =  results.map(item => ({
      ...item,          // spread all original properties
      genreStr: getGenreNames(item.genre_ids)          // add the new field with a value
    }));
    console.log(movies);
    res.render('searchResults', { movies: movies, movieTitle: movieTitle });
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).send('Error fetching movie data');
  }
});

app.post('/saveMovie', async (req, res) => {
  const tmdb_id = req.body.tmdb_id;

  if (!tmdb_id) {
    return res.status(400).send('Missing tmdb_id in request body');
  }

  try {
    const movieDetails = await fetchMovieById(tmdb_id);

    if (!movieDetails) {
      return res.status(404).send('Movie not found on TMDb');
    }

    const insertSql = `INSERT INTO movies (tmdb_id, title, overview, release_date, poster_path, genres) VALUES (?, ?, ?, ?, ?, ?)`;
    const genresString = movieDetails.genres.map(genre => genre.name).join(',');

    db.run(insertSql, [movieDetails.id, movieDetails.title, movieDetails.overview, movieDetails.release_date, movieDetails.poster_path, genresString], function(err) {
      if (err) {
        console.error('Error saving movie to database:', err.message);
        return res.status(500).send('Error saving movie to database');
      }
      res.status(200).send(`Movie with TMDb ID ${tmdb_id} saved successfully with ID ${this.lastID}`);
    });
  } catch (error) {
    console.error('Error fetching or saving movie:', error);
    res.status(500).send('An error occurred while fetching or saving the movie');
  }
});


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const db = new sqlite3.Database('./mozi.sqlite', sqlite3.OPEN_READONLY, (err) => {
  if (err) { console.error(err.message); }
  console.log('Connected to the mozi database.');
});

init();
console.log('fetchMovieData initialized.');

