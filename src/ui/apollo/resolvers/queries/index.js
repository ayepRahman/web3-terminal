export default {
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
};
