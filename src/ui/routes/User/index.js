// import React, { Component, Fragment, useEffect, useState } from 'react';
// import { Query, withApollo } from 'react-apollo';
// import {
//   Grid,
//   Card,
//   CardActions,
//   CardActionArea,
//   CardMedia,
//   CardContent,
//   Button,
// } from '@material-ui/core';
// import { withSnackbar } from 'notistack';
// import InfiniteScroll from 'react-infinite-scroller';
// import LinearProgress from '@material-ui/core/LinearProgress';
// import gql from 'graphql-tag';

// import './index.scss';

// const GET_USERS = gql`
//   query getUsers($first: Int, $skip: Int) {
//     users(first: $first, skip: $skip) {
//       id
//       exchangeBalances {
//         userAddress
//         ethWithdrawn
//         exchangeAddress
//         tokensWithdrawn
//         totalEthFeesPaid
//         totalTokenFeesPaid
//       }
//       txs {
//         id
//         timeStamp
//         ethAmount
//         tokenAmount
//         userAddress
//         exchangeAddress
//       }
//     }
//   }
// `;

// // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARCA3a8h3USjmdXWmistANmWf5Q1VSebtQHWAzyfwJ-a-_ApouQ

// const Home = props => {
//   const { enqueueSnackbar } = props;

//   return (
//     <Query query={GET_USERS} variables={{ first: 4 }}>
//       {({ loading, error, data, fetchMore, updateQuery }) => {
//         if (loading) return <LinearProgress color="primary" />;

//         if (error) {
//           enqueueSnackbar(error.message, {
//             variant: 'error',
//             action: (
//               <Button color="default" variant="flat" size="small">
//                 {'Dismiss'}
//               </Button>
//             ),
//           });
//         }

//         return (
//           <Grid className="home" container justify="center">
//             <Grid className="text-center pb-3" item xs={12}>
//               <h1>Web3 Terminal</h1>
//             </Grid>

//             <Grid item xs={6}>
//               <InfiniteScroll
//                 pageStart={0}
//                 loadMore={() => {
//                   fetchMore({
//                     variables: {
//                       skip: 4,
//                     },
//                     updateQuery: (prevResult, { fetchMoreResult }) => {
//                       if (!fetchMoreResult) return prevResult;
//                       return Object.assign({}, prevResult, {
//                         users: [...prevResult.users, ...fetchMoreResult.users],
//                       });
//                     },
//                   });
//                 }}
//                 hasMore={true}
//                 loader={
//                   <Grid className="pt-5" item xs={12}>
//                     <LinearProgress color="primary" />
//                   </Grid>
//                 }
//               >
//                 <Grid container spacing={32}>
//                   {data &&
//                     data.users &&
//                     data.users.map((user, index) => {
//                       return (
//                         <Grid key={index} item xs={6}>
//                           <Card>
//                             <CardActionArea>
//                               <CardMedia
//                                 component="img"
//                                 className="card"
//                                 title="Crypto"
//                                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARCA3a8h3USjmdXWmistANmWf5Q1VSebtQHWAzyfwJ-a-_ApouQ"
//                               />
//                               <CardContent>
//                                 <ul>
//                                   <li>
//                                     <b>User Id:</b> {user.id}
//                                   </li>
//                                   <li>
//                                     <b>User Address:</b> {user.exchangeBalances[0].userAddress}
//                                   </li>
//                                 </ul>
//                               </CardContent>
//                             </CardActionArea>
//                             <CardActions>
//                               <Button size="small">View More</Button>
//                             </CardActions>
//                           </Card>
//                         </Grid>
//                       );
//                     })}
//                 </Grid>
//               </InfiniteScroll>
//             </Grid>
//           </Grid>
//         );
//       }}
//     </Query>
//   );
// };

// export default withApollo(withSnackbar(Home));
