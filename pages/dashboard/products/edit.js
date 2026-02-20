import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/DashboardLayout";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: ctx.query.id },
  });

  if (!product) return { notFound: true };

  return {
    props: {
      product: {
        ...product,
        createdAt: product.createdAt.toISOString(),
      },
    },
  };
}

export default function EditProduct({ product }) {
  const router = useRouter();

  // 🔥 penting: jadikan string
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(product.image);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard/products_admin");
    } else {
      alert("Gagal update produk");
    }
  }

  return (
    <AdminLayout role="admin">
      <h1 style={styles.title}>Edit Product</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <p style={styles.info}>
          Dibuat pada:{" "}
          {new Date(product.createdAt).toLocaleDateString()}
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Nama Produk</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Harga</label>
          <input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Stok</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(
                URL.createObjectURL(e.target.files[0])
              );
            }}
          />
        </div>

        {preview && (
          <img
            src={preview}
            width="120"
            style={{ marginBottom: "12px" }}
          />
        )}

        <button style={styles.button}>
          Simpan Perubahan
        </button>
      </form>
    </AdminLayout>
  );
}

const styles = {
  title: { marginBottom: "16px" },
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
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  info: {
    fontSize: "12px",
    marginBottom: "12px",
    color: "#6b7280",
  },
};
