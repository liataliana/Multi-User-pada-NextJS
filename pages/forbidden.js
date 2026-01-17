import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/peringatan.module.css";

export default function Unauthorized() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role) {
          setRole(data.user.role);
        }
      });
  }, []);

  function goHome() {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "user") {
      router.push("/dashboard/user");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code}>403</div>
        <h1 className={styles.title}>Access Denied</h1>

        <p className={styles.text}>
          kamu tidak punya izin untuk mengakses halaman ini.
          silakan kembali ke dashboard kamu atau login ulang.
        </p>

        <div className={styles.actions}>
          <button onClick={goHome} className={styles.btnPrimary}>
            home
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={styles.btnDanger}
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
