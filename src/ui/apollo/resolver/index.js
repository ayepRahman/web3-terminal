// import gql from "graphql-tag";

export const resolvers = {
  Mutation: {
    updateUsers: (root, { users }, { cache }) => {
      // using clientState defaults to manipulate signUpModal isOpen variables

      const data = {
        users,
      };

      cache.writeData({ data });
      return null;
    },
    getUserById: (root, { user }, { cache }) => {
      console.log('getUserById - resolve', cache);

      // const data = {
      //   loginModal: {
      //     isOpen: !isOpen,
      //     __typename: 'loginModal',
      //   },
      // };

      // cache.writeData({ data });
      return null;
    },
  },
};
