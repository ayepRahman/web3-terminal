// NOTE: best practice for resolver is to pass a gql tag with all the params

export default {
  updateUsers: (root, { id, users }, { cache }) => {
    const data = {
      store: {
        users,
        __typename: 'Store',
      },
    };

    cache.writeData({ data });
    return null;
  },
};
