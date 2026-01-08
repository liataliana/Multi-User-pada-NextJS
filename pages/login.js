import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      const session = await getSession();
      const role = session?.user?.role;

      if (role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/user");
    } else {
      setError("email atau password salah");
    }

    setIsLoading(false);
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Login</h2>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="auth-group">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>

        <div className="auth-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>

        <button className="auth-btn" disabled={isLoading}>
          {isLoading ? "loading..." : "login"}
        </button>
      </form>

      <div className="auth-link">
        belum punya akun? <a href="/register">daftar</a>
      </div>
    </AuthLayout>
  );
}
