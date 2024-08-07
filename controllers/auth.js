exports.getLogin = (req, res, next) => {
    const cookie = req.get('Cookie');
    let isLoggedIn = false;
  
    if (cookie) {
      const cookiesArray = cookie.split(';').map(c => c.trim().split('='));
      const loggedInCookie = cookiesArray.find(c => c[0] === 'loggedIn');
      isLoggedIn = loggedInCookie ? loggedInCookie[1] === 'true' : false;
    }
  
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: isLoggedIn
    });
  };
  
  exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
    res.redirect('/');
  };
