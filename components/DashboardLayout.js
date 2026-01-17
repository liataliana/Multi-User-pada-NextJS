import { signOut } from "next-auth/react";

export default function DashboardLayout({ children, role }) {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>{role.toUpperCase()} PANEL</h2>

        {role === "admin" && (
          <>
            <a href="/dashboard/admin">Dashboard</a>
            <a href="#">Manage Users</a>
          </>
        )}

        {role === "user" && (
          <>
            <a href="/dashboard/user">Dashboard</a>
            <a href="#">Profile</a>
          </>
        )}

        <a onClick={() => signOut({ callbackUrl: "/login" })} style={{ cursor: "pointer" }}> Logout </a>
      </div>

      <div className="content">
        {children}
      </div>
    </div>
  );
}
