import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../components/DashboardLayout";
import style from "../../styles/peringatan.module.css";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session)
    return {
      redirect: { destination: "/login", permanent: false },
    };

  if (session.user.role !== "admin")
    return {
      redirect: { destination: "/unauthorized", permanent: false },
    };

  return { props: {} };
}

export default function ProductsAdmin() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  async function handleDelete(id) {
  const confirmDelete = confirm(
    "Yakin ingin menghapus produk ini?"
  );

  if (!confirmDelete) return;

  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
  } else {
    alert("Produk berhasil dihapus");
    location.reload();
  }
}


  return (
    <DashboardLayout role="admin">
      <h1>Manage Products</h1>

      <button onClick={() => router.push("/dashboard/products/create")}>
        + Tambah Produk
      </button>

      {/* ✅ KALAU BELUM ADA DATA */}
      {products.length === 0 ? (
        <p>Belum ada data</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>No</th>
              <th>Gambar</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
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

                <td>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/products/edit?id=${p.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(p.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer className={style.footer} >
        <p>© 2026 Natalia Manumpil — XI RPL</p>
      </footer>
    </DashboardLayout>
  );
}
