document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    window.location.href = '/dashboard.html';
    return;
  }

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const className = document.getElementById('className').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showAlert('alert', 'Passwords do not match');
      return;
    }

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, className, role: 'student' })
      });

      setAuth(data);
      window.location.href = '/dashboard.html';
    } catch (error) {
      showAlert('alert', error.message);
    }
  });
});
