document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    const user = getUser();
    window.location.href = user && user.role === 'admin' ? '/admin-dashboard.html' : '/dashboard.html';
    return;
  }

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setAuth(data);
      window.location.href = data.role === 'admin' ? '/admin-dashboard.html' : '/dashboard.html';
    } catch (error) {
      showAlert('alert', error.message);
    }
  });
});
