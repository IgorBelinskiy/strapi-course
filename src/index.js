'use strict';

const { likePostMutation, getLikePostResolver, likePostMutationConfig } = require('./api/post/graphql/post');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    // extensionService.shadowCRUD('api::post.post').disable();
    // extensionService.shadowCRUD('api::post.post').disableQueries();
    // extensionService.shadowCRUD('api::post.post').disableMutations();
    // extensionService.shadowCRUD('api::tag.tag').disableActions(['update']);


    const extension = ({ nexus }) => ({
      // Nexus
      // GraphQL SDL
      typeDefs: likePostMutation,
      resolvers: {
        Mutation: {
          likePost: getLikePostResolver(strapi)
        },
      },
      resolversConfig: {
        'Mutation.likePost': likePostMutationConfig
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap() {
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'], // only listen to the `user` model
      afterCreate: async ({ result }) => {
        // create an Author instance from the fields of the Admin user

        const {
          id,
          firstname,
          lastname,
          email,
          username,
          createdAt,
          updatedAt,
        } = result;

        await strapi.service('api::author.author').create({
          data: { firstname, lastname, email, username, createdAt, updatedAt, admin_user: [id] }
        });
      },
      afterUpdate: async ({ result }) => {
        // get the ID of the Author that corresponds to the Admin user

        const correspondingAuthor = await strapi.service('api::author.author')
          .find({ admin_user: [result.id] });
        console.log('correspondingAuthor', correspondingAuthor)

        const user = correspondingAuthor?.results[0];
        const userId = user?.id;

        // update the Author accordingly
        const { firstname, lastname, email, username, createdAt, updatedAt } = result;
        await strapi.service('api::author.author').update(userId, {
          data: { firstname, lastname, email, username, createdAt, updatedAt }
        })
      }
    })
  },
};
