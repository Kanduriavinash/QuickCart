// Simple client-side auth helper for demonstration purposes only
// Stores users in localStorage under key 'qc_users' as an array of {name,email,password}
// Stores current session under 'qc_currentUser' and 'qc_loggedIn' flag

(function(){
  function getUsers(){
    try{ return JSON.parse(localStorage.getItem('qc_users')||'[]') }catch(e){ return [] }
  }
  function saveUsers(users){ localStorage.setItem('qc_users', JSON.stringify(users)); }

  function registerUser(name, email, password){
    const users = getUsers();
    if (users.find(u=>u.email.toLowerCase()===email.toLowerCase())){
      return { success: false, message: 'An account with this email already exists.' };
    }
    users.push({ name: name.trim(), email: email.trim().toLowerCase(), password: btoa(password) });
    saveUsers(users);
    return { success: true };
  }

  function loginUser(email, password){
    const users = getUsers();
    const user = users.find(u=>u.email===email.trim().toLowerCase());
    if (!user) return { success: false, message: 'No account found for this email.' };
    if (user.password !== btoa(password)) return { success: false, message: 'Incorrect password.' };
    localStorage.setItem('qc_currentUser', JSON.stringify({ name: user.name, email: user.email }));
    localStorage.setItem('qc_loggedIn', '1');
    return { success: true };
  }

  function logoutUser(){
    localStorage.removeItem('qc_currentUser');
    localStorage.removeItem('qc_loggedIn');
    // optional: redirect to login
    if (location.pathname && !location.pathname.endsWith('index1.html')){
      location.href = 'index1.html';
    }
  }

  function isLoggedIn(){
    return localStorage.getItem('qc_loggedIn')==='1';
  }

  function getCurrentUser(){
    try{ return JSON.parse(localStorage.getItem('qc_currentUser')||'null') }catch(e){ return null }
  }

  // Protect the page: if not logged in, redirect to login page
  function protectPage(){
    // allow login/register pages to be visited without redirect
    const p = location.pathname.toLowerCase();
    if (p.endsWith('index1.html') || p.endsWith('index2.html') || p.endsWith('index.html') ) return;
    if (!isLoggedIn()){
      // Add returnUrl so after login user can be redirected back
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      location.href = 'index1.html?returnUrl=' + returnUrl;
    }
  }

  // Expose functions globally
  window.QCAuth = {
    registerUser,
    loginUser,
    logoutUser,
    isLoggedIn,
    getCurrentUser,
    protectPage
  };

  // Auto-protect when this file is loaded
  try{ protectPage(); }catch(e){ /* ignore in environments where location isn't available */ }
})();
