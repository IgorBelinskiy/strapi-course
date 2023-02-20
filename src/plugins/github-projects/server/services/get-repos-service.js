'use strict';

const { request } = require("@octokit/request");
const axios = require("axios");

module.exports = ({ strapi }) => ({
  async getProjectForRepo(repo) {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany("plugins::github-projects.project", {
      filters: {
        repositoryId: id,
      }
    })
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
        id, name, shortDescription: description, longDescription, url: html_url, default_branch
      };

    }));
  },
});
