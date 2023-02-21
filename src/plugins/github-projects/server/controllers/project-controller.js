'use strict';

module.exports = ({ strapi }) => ({
  async create(ctx) {
    const repo = ctx.request.body;
    console.log('repo', repo)
    const newProject = await strapi
      .plugin('github-projects')
      .service('projectService')
      .create(repo, ctx.state.user.id);
    return newProject;
  },
});
