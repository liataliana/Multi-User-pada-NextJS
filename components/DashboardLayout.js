import { signOut } from "next-auth/react";

export default function DashboardLayout({ children, role = "" }) {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>{role ? role.toUpperCase() : "DASHBOARD"} PANEL</h2>

        {role === "admin" && (
          <>
            <a href="/dashboard/admin">Dashboard</a>
            <a href="/dashboard/products_admin">Manage Products</a>
          </>
        )}

        {role === "user" && (
          <>
            <a href="/dashboard/user">Dashboard</a>
            <a href="/dashboard/products_user">Products</a>
          </>
        )}

        <a
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{ cursor: "pointer" }}
        >
          Logout
        </a>
      </div>

      <div className="content">{children}</div>
    </div>
  );
}
