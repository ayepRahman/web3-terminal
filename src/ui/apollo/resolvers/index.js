// can split resolvers to Mutation, Query, Subscription individually
import Mutation from 'ui/apollo/resolvers/mutations';
import Query from 'ui/apollo/resolvers/queries';

export const resolvers = {
  Mutation: Mutation,
  Query: Query,
};
