module.exports = {
  likePostMutation: `
    type Mutation {
      likePost(id: ID!): PostEntityResponse
    }
  `,
  getLikePostResolver: (strapi) => {
    const resolverFunc = async (parent, args, ctx, info) => {
      const { id: postId } = args;
      const userId = ctx.state.user.id;
      const likedPost = await strapi.service('api::post.post').likePost({ userId, postId });
      const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
      const formattedResponse = toEntityResponse(likedPost, {
        args,
        resourceUID: 'api::post.post',
      });
      return formattedResponse;
    }
    return resolverFunc;
  },
  likePostMutationConfig: {
    auth: {
      scope: ['api::post.post.likePost']
    }
  },
};
