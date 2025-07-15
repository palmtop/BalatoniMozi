import { release } from 'os';
import { getMovieDetails, getRating } from './fetchMovieData';
export async function saveMovie(tmdb_id, movie_title, db, res){
    var movie;
    movie = await getMovieDetails(tmdb_id);
    if (!movie) {
        throw new Error('Movie details not found');
    }

    const rating = await getRating(tmdb_id);
    var genresString = movie.genres.map(genre => genre.name).join(', ');
    
    const sql = `INSERT INTO movies (tmdb_id,name,tmdb_name,poster_file,genre,summary,year,rating) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(tmdb_id) DO NOTHING`;
    db.run(sql, [tmdb_id,
        movie_title,
        movie.title,
        movie.poster_path,
        genresString,
        movie.overview,
        movie.release_date.split('-')[0],
        rating 
    ], function(err) {
        if (err) {
            console.error('Error saving movie to database:', err.message);
            return res.status(500).send('Error saving movie to database');
        }
        res.status(200).send(`Movie with TMDb ID ${tmdb_id} saved successfully with ID ${this.lastID}`);
    }); 
    console.log(`Movie with TMDb ID ${tmdb_id} saved successfully.`);
    return res;
};