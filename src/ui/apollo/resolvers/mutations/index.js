export default {
  updateUsers: (root, { users }, { cache }) => {
    // using clientState defaults to manipulate signUpModal isOpen variables

    const data = {
      store: {
        users,
      },
    };

    cache.writeData({ data });
    return null;
  },
};
