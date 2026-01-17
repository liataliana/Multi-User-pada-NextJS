import styles from "../styles/peringatan.module.css";
import Link from "next/link";

export default function Unauthorized401() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code}>401</div>
        <h1 className={styles.title}>Unauthorized</h1>

        <p className={styles.text}>
          kamu belum login.  
          silakan login terlebih dahulu untuk mengakses halaman ini.
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.btnPrimary}>
            login
          </Link>
        </div>
      </div>
    </div>
  );
}
