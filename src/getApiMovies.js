import { searchMovies } from "./tmdbApi.js";

export const getApiMovies = async (request, reply) => {
  try {
    const movies = await searchMovies(request.query.title);
    console.log(movies);
    reply.send(movies);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};
