import { getSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";

export default function AdminPage({ user }) {
  return (
    <DashboardLayout role="admin">
      <div className="card">
        <h1>Welcome Admin 👑</h1>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}


