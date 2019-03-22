export default {
  updateUsers: (root, { id, users }, { cache }) => {
    // using clientState defaults to manipulate signUpModal isOpen variables
    console.log('updateUsers - resolver', users);

    const data = {
      store: {
        users,
      },
    };

    cache.writeData({ data });
    return null;
  },
};
