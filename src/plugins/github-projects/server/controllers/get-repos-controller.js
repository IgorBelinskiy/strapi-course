'use strict';

module.exports = ({ strapi }) => ({
  async index(ctx) {
    ctx.body = await strapi
      .plugin('github-projects')
      .service('getReposService')
      .getPublicRepos();
  },
});
