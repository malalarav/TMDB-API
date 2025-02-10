import { updateMovieFromWatchlist } from "./tmdbApi.js";
import { searchMovies } from "./tmdbApi.js";

export const postRemoveFromWatchlist = async (request, reply) => {
  try {
    const { movieId, title } = request.body;
    if (title) {
      const movies = await searchMovies(title);
      if (movies.length === 0) {
        reply.status(404).send({ error: "Movie not found" });
      }
      const response = await updateMovieFromWatchlist(movies[0].id, false);
      reply.send(response);
    } else {
      try {
        const response = await updateMovieFromWatchlist(movieId, false);
        reply.send(response);
      } catch (error) {
        if (error.response?.status === 404) {
          reply.status(404).send({ error: "Movie not found" });
        } else {
          reply.status(500).send({ error: error.message });
        }
      }
    }
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};
