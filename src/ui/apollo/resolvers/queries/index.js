export default {
  getUserById: (root, { user }, context) => {
    console.log('getUserById - resolver', context);

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
