export default function (server) {

  server.route({
    path: '/api/reactor/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

};
