'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({strapi}) => ({
  // Method 1: Creating an entirely custom action
  async exampleAction(ctx) {
    await strapi.service('api::post.post').exampleService({ myParam: 'example' });
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  // Method 2: Wrapping a core action (leaves core logic in place)
  async find(ctx) {
    // some custom logic here
    ctx.query = { ...ctx.query, local: 'en' }; //publicationState=preview

    console.log('ctx.query', ctx.query)

    // // Calling the default core action
    // const { data, meta } = await super.find(ctx);
    //
    // // some more custom logic
    // meta.date = Date.now();
    //
    // return { data, meta };

    // solution 1 (worst)
    //fetching all posts (including premium)
    // const { data, meta } = await super.find(ctx);
    // if (ctx.state.user) {
    //   return { data, meta };
    // }
    // // not logged in, so filter out premium posts
    // const filteredData = data.filter((post) => !post.attributes.premium);
    // return { data: filteredData, meta };


    // solution 2 (better)
    // if the request is authenticated
    // const isRequestNonPremium = ctx.query.filters && !ctx.query.filters.premium;
    // if (ctx.state.user || isRequestNonPremium) {
    //   // call the default core action
    //   return await super.find(ctx);
    // }
    // // if the request is public
    // // with filter params
    // const { query } = ctx;
    // const filteredPosts = await strapi.service('api::post.post').find({
    //   ...query,
    //   filters: {
    //     ...query.filters,
    //     premium: false,
    //   }
    // });
    // const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);
    // return this.transformResponse(sanitizedPosts);

    // solution 3 (best)
    // if the request is authenticated or asking for public content only
    const isRequestNonPremium = ctx.query.filters && !ctx.query.filters.premium;
    if (ctx.state.user || isRequestNonPremium) {
      // call the default core action
      return await super.find(ctx);
    }
    // if the request is public
    const publicPosts = await strapi.service('api::post.post').findPublic(ctx.query);
    const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
    return this.transformResponse(sanitizedPosts);
  },

  // Method 3: Replacing a core action
  async findOne(ctx) { // 'posts/:id'
    console.log('ctx.params', ctx.params)
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi
      .service('api::post.post')
      .findOne(id, query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    // return sanitizedEntity;
    return this.transformResponse(sanitizedEntity);
  },
}));

