export const getHelloWorld = async (request, reply) => {
  reply.send({
    message: "Hello World from the server " + Date.now(),
  });
};
