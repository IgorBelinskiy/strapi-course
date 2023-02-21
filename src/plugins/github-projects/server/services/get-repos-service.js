'use strict';

const { request } = require("@octokit/request");
const axios = require("axios");
const md = require('markdown-it')();

module.exports = ({ strapi }) => ({
  async getProjectForRepo(repo) {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany("plugin::github-projects.project", {
      filters: {
        repositoryId: id,
      }
    })
    if (matchingProjects.length === 1) {
      return matchingProjects[0].id;
    }
    return null;
  },
  async getPublicRepos() {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: "public",
    });
    // https://raw.githubusercontent.com/artcoded-net/next-strapi-blog/main/README.md
    return Promise.all(result.data.map(async (item) => {
      const { id, name, description, html_url, owner, default_branch } = item;
      const readmeUrl= `https://raw.githubusercontent.com/IgorBelinskiy/JavaScript/master/README.md`;
      const longDescription = (await axios.get(readmeUrl)).data;
      const repo = {
        id,
        name,
        shortDescription: 'description',
        longDescription: md.render(longDescription).replaceAll('\n', '<br/>'),
        url: html_url,
        default_branch
      };
      // const relatedProjectId = await this.getProjectForRepo(repo);
      const relatedProjectId = await strapi
        .plugin('github-projects')
        .service('getReposService')
        .getProjectForRepo(repo);
      return {
        ...repo,
          projectId: relatedProjectId,
      }
      // return repo;
    }));
  },
});
