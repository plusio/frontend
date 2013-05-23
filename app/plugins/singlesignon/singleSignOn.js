  // Callback for Google+ Sign-In
  function signinCallback(authResult) {
    console.log(authResult);
    if (authResult['access_token']) {
      // User successfully authorized the G+ App!
      console.log('User authorized application');
    } else if (authResult['error']) {
      // User has not authorized the G+ App!
      console.log('User has not authorized application');
    }
  }