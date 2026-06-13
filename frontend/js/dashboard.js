document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;
  const user = getUser();

  if (user.role === 'admin') {
    window.location.href = '/admin-dashboard.html';
    return;
  }

  document.getElementById('userName').textContent = user.fullName;
  document.getElementById('userClass').textContent = user.className;
  document.getElementById('welcomeName').textContent = user.fullName.split(' ')[0];

  try {
    const [topics, results, progress] = await Promise.all([
      apiRequest(`/topics?className=${user.className}`),
      apiRequest('/results/my'),
      apiRequest('/progress/my')
    ]);

    document.getElementById('topicCount').textContent = topics.length;
    document.getElementById('testCount').textContent = results.length;
    document.getElementById('lessonsDone').textContent = progress.length;

    if (results.length > 0) {
      const avg = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
      document.getElementById('avgScore').textContent = avg + '%';
    }

    const tbody = document.getElementById('recentResults');
    if (results.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No tests taken yet. Start learning!</td></tr>';
    } else {
      tbody.innerHTML = results.slice(0, 5).map(r => `
        <tr>
          <td>${r.topic ? r.topic.title : 'N/A'}</td>
          <td><span class="badge ${r.score >= 50 ? 'badge-success' : 'badge-danger'}">${r.score}%</span></td>
          <td>${r.correctAnswers}/${r.totalQuestions}</td>
          <td>${formatDate(r.completedAt)}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
});
