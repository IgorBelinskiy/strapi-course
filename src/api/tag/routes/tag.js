'use strict';

/**
 * tag router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::tag.tag', {
  prefix: '',
  only: ['find', 'findOne'],
  except: ['create', 'update', 'delete'],
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {},
    create: {},
    update: {},
    delete: {},
  },
});
