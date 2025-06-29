document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("fetchDataModal");
    const span = document.getElementsByClassName("close")[0];
    const movieTitleInput = document.getElementById("movieTitleInput");
    const searchMovieButton = document.getElementById("searchMovieButton");
    const searchResultsDiv = document.getElementById("searchResults");
    const cancelFetchButton = document.getElementById("cancelFetchButton");
    var movieId="";

    // Get all buttons that open the modal
    const fetchButtons = document.querySelectorAll(".fetch-data-button");

    fetchButtons.forEach(button => {
        button.addEventListener('click', function () {
            // You might want to store the movie ID here if needed later
            movieId = this.dataset.movieId;
            movieTitleInput.value = movieId;
            modal.style.display = "block";
        });
    });


    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        searchResultsDiv.innerHTML = ''; // Clear previous results
        movieTitleInput.value = ''; // Clear input field
    }

    // When the user clicks on the cancel button, close the modal
    cancelFetchButton.onclick = function () {
        modal.style.display = "none";
        searchResultsDiv.innerHTML = ''; // Clear previous results
        movieTitleInput.value = ''; // Clear input field
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            searchResultsDiv.innerHTML = ''; // Clear previous results
            movieTitleInput.value = ''; // Clear input field
        }
    }

    // Event listener for the search button
    searchMovieButton.addEventListener('click', function () {
        const movieTitle = movieTitleInput.value.trim();
        window.location.href = "/fetchMovie/"+encodeURIComponent(movieId)+"/"+encodeURIComponent(movieTitle);
    });


});