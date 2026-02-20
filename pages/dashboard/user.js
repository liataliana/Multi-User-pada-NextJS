import { getSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";
import style from "../../styles/peringatan.module.css";

export default function UserPage({ user }) {
  return (
    <DashboardLayout role="user">
      <div className="card">
        <h1>Welcome User 👋</h1>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
      <footer className={style.footer} >
        <p>© 2026 Natalia Manumpil — XI RPL</p>
      </footer>
    </DashboardLayout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session || session.user.role !== "user") {
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
