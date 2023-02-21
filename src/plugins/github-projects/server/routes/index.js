module.exports = [
  {
    method: 'GET',
    path: '/repos',  // localhost:1337/github-projects/repos
    handler: 'getReposController.index',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
      // auth: false,
    },
  },
  {
    method: 'POST',
    path: '/project',  // localhost:1337/github-projects/repos
    handler: 'projectController.create',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
      // auth: false,
    },
  },
];
