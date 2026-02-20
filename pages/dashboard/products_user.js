import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import style from "../../styles/peringatan.module.css";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session)
    return {
      redirect: { destination: "/login", permanent: false },
    };

  if (session.user.role !== "user")
    return {
      redirect: { destination: "/unauthorized", permanent: false },
    };

  return { props: {} };
}

export default function ProductsUser() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <DashboardLayout role="user">
      <h1>Daftar Produk</h1>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>No</th>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Stok</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>
                <img src={p.image} width="60" />
              </td>
              <td>{p.name}</td>
              <td>{rupiah.format(p.price)}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className={style.footer} >
        <p>© 2026 Natalia Manumpil — XI RPL</p>
      </footer>
    </DashboardLayout>
  );
}
