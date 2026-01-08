import { useState } from "react";
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState("");

  async function handleSubmit(e){
    e.preventDefault();
    if(password!==confirm) return setError("password tidak sama");

    const res = await fetch("/api/user/create",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({name,email,password})
    });

    if(res.ok) router.push("/login");
    else setError("gagal register");
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Register</h2>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="auth-group">
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>

        <div className="auth-group">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>

        <div className="auth-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>

        <div className="auth-group">
          <label>Confirm Password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        </div>

        <button className="auth-btn">register</button>
      </form>

      <div className="auth-link">
        sudah punya akun? <a href="/login">login</a>
      </div>
    </AuthLayout>
  );
}
