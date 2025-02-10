import { getUserWatchlist } from "./tmdbApi.js";

export const getApiWatchlist = async (_, reply) => {
  try {
    const watchlist = await getUserWatchlist();
    reply.send(watchlist);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};
