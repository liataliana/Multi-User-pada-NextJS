import { getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/DashboardLayout";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("image", image);

      const res = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menyimpan produk");
      }

      router.push("/dashboard/products_admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout role="admin">
      <h1 style={styles.title}>Create Product</h1>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
        encType="multipart/form-data"
      >
        {/* NAMA */}
        <div style={styles.field}>
          <label style={styles.label}>Nama Produk</label>
          <input
            type="text"
            placeholder="Contoh: Laptop ASUS"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* HARGA */}
        <div style={styles.field}>
          <label style={styles.label}>Harga</label>
          <input
            type="number"
            min="1"
            placeholder="Contoh: 15000000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* STOCK */}
        <div style={styles.field}>
          <label style={styles.label}>Stok</label>
          <input
            type="number"
            min="0"
            placeholder="Contoh: 10"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* GAMBAR */}
        <div style={styles.field}>
          <label style={styles.label}>Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.input}
            required
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </form>
    </AdminLayout>
  );
}

const styles = {
  title: {
    marginBottom: "16px",
  },
  form: {
    background: "#fff",
    padding: "24px",
    maxWidth: "420px",
    borderRadius: "8px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "12px",
  },
};
