
interface AuthRes {
  access_token: string;
  token_type: string;
}

export default async function Page() {
  const fetchToken = await fetch("http://localhost:8000/token", {
    body: new URLSearchParams({
      username: "hello",
      password: "hello",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const data = await fetchToken.json();

  console.log("fetch_token: ", data)

  const users = await fetch("http://localhost:8000/user/me", {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.access_token}`
    }
  })

  const userData = await users.json()

  console.log("users: ", userData);
  return null;
}
