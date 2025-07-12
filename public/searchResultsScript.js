async function selectMovie(tmdb_id) {
  try {
    const response = await fetch('/saveMovie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tmdb_id: tmdb_id })
    });

    if (response.ok) {
      window.location.href = '/admin';
    } else {
      console.error('Failed to save movie:', response.statusText);
      // Handle error appropriately, maybe show a message to the user
    }
  } catch (error) {
    console.error('Error saving movie:', error);
    // Handle network errors or other exceptions
  }
}