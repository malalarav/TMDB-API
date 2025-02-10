const getTmdbHeaders = () => {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  };
};

/**
 *
 * @param {*} query
 * @returns
 */
export const searchMovies = async (query) => {
  const headers = getTmdbHeaders();
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      ...headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  const data = await response.json();

  return data.results;
};

export const getUserWatchlist = async () => {
  const headers = getTmdbHeaders();
  const accountId = process.env.TMDB_ACCOUNT_ID;
  const response = await fetch(
    `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies`,
    {
      ...headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch watchlist: ${response.status}`);
  }

  const data = await response.json();

  return data.results;
};

export const updateMovieFromWatchlist = async (
  movieId,
  addToWatchlist = true
) => {
  const headers = getTmdbHeaders();
  const accountId = process.env.TMDB_ACCOUNT_ID;
  const response = await fetch(
    `https://api.themoviedb.org/3/account/${accountId}/watchlist`,
    {
      ...headers,
      method: "POST",
      body: JSON.stringify({
        media_id: movieId,
        watchlist: addToWatchlist,
        media_type: "movie",
      }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      `Failed to add movie to watchlist: ${response.status}`
    );
    error.response = response;
    throw error;
  }

  return response.json();
};
