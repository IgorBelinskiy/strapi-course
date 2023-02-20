module.exports = {
  beforeCreate: async ({ params }) => {
    // find the Admin User who is about to create the post

    const adminUserId = params.data.createdBy;

    // find the corresponding Author
    const author = await strapi.entityService.findMany('api::author.author', {
      filters: {
        admin_user: [adminUserId]
      },
    });

    const firstAuthor = author[0];

    // update the data payload of the request for creating the post

    params.data.authors.connect = [...params.data.authors.connect, firstAuthor.id];
  }
}
