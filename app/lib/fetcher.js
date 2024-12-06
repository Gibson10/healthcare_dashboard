export async function fetcher(url, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}
