/* eslint-disable linebreak-style */
const routes = [
  {
    method: 'GET',
    path: '/hello/{name?}',
    handler: (request, h) => {
      const { name = 'stranger' } = request.params;
      return `Hello, ${name}!`;
    },
  },
  {
    method: 'GET',
    path: '/about',
    handler: (request, h) => 'About page',
  },
];

module.exports = routes;
