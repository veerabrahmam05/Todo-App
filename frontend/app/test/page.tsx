"use client";
import { useAuthHeader } from "@/contexts/auth-provider";

interface AuthRes {
  access_token: string;
  token_type: string;
}

export default function Page() {
  const { authHeader, setAuthHeader } = useAuthHeader();

  return (
    <div>
      <button
        onClick={() => {
          setAuthHeader({
            accessToken: "token from the backend",
            tokenType: "type of the token",
          });
        }}
      >
        click me!
      </button>
      <button
        onClick={() => {
          console.log("context api data: ", authHeader);
        }}
      >
        click to conosle the logs
      </button>
    </div>
  );
}
