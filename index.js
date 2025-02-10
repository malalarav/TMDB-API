import Fastify from 'fastify';
import fetch from 'node-fetch';

const fastify = Fastify({ logger: true });

const TMDB_API_KEY = '9cb934d5388e6a1d0599865ab20785c4'; // Remplacez par votre clé API
let watchList = [];

// Route de base
fastify.get('/', async (request, reply) => {
  return { message: 'Hello, Fastify!' };
});

// Route pour afficher la watch list
fastify.get('/watchlist', async (request, reply) => {
    return { watchList };
  });
  

// Recherche de films via TMDB
fastify.get('/search', async (request, reply) => {
  const { query } = request.query;
  if (!query) {
    return reply.status(400).send({ error: 'Query parameter is required' });
  }
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to fetch movie data' });
  }
});

// Ajouter un film à la watch list par ID et titre
fastify.post('/watchlist/id', async (request, reply) => {
  const { id, title } = request.body;
  if (!id || !title) {
    return reply.status(400).send({ error: 'Movie ID and title are required' });
  }
  if (watchList.find((movie) => movie.id === id)) {
    return reply.status(409).send({ error: 'Movie already in watch list' });
  }
  watchList.push({ id, title });
  return { message: 'Movie added to watch list', watchList };
});

// Ajouter un film à la watch list par titre uniquement
fastify.post('/watchlist/title', async (request, reply) => {
  const { title } = request.body;
  if (!title) {
    return reply.status(400).send({ error: 'Movie title is required' });
  }
  if (watchList.find((movie) => movie.title === title)) {
    return reply.status(409).send({ error: 'Movie already in watch list' });
  }
  watchList.push({ title });
  return { message: 'Movie added to watch list', watchList };
});

// Retirer un film de la watch list par ID
fastify.delete('/watchlist/id', async (request, reply) => {
  const { id } = request.body;
  if (!id) {
    return reply.status(400).send({ error: 'Movie ID is required' });
  }
  watchList = watchList.filter((movie) => movie.id !== id);
  return { message: 'Movie removed from watch list', watchList };
});

// Retirer un film de la watch list par titre
fastify.delete('/watchlist/title', async (request, reply) => {
  const { title } = request.body;
  if (!title) {
    return reply.status(400).send({ error: 'Movie title is required' });
  }
  watchList = watchList.filter((movie) => movie.title !== title);
  return { message: 'Movie removed from watch list', watchList };
});

// Démarrer le serveur
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
