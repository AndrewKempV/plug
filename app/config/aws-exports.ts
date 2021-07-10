const awsConfig = {
  // identityPoolId: '<Cognito Identity Pool ID>',
  region: "us-east-1",
  userPoolId: "us-east-1_Pt37z0m2l",
  userPoolWebClientId: "2ka961ct2c5vj4h53ggknql2b0",
  mandatorySignIn: true,
  // oauth: {
  //   domain: 'plugg-dev.auth.us-east-1.amazoncognito.com',
  //   scope: ['email', 'profile', 'aws.cognito.signin.user.admin', 'openid'],
  //   redirectSignIn: 'com.pluggnation.plugg://login',
  //   redirectSignOut: 'com.pluggnation.plugg://logout',
  //   responseType: 'code',
  //   options: {
  //       AdvancedSecurityDataCollectionFlag: false
  //   }
  // },
  Storage: {
    region: "us-east-1"
  }
};

export default awsConfig;
