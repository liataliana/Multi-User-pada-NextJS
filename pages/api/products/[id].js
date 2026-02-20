import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = String(req.query.id);

  // ======================
  // UPDATE PRODUCT
  // ======================
  if (req.method === "PUT") {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(500).json({ message: "Form error" });
        }

        const name = Array.isArray(fields.name)
          ? fields.name[0]
          : fields.name;

        const rawPrice = Array.isArray(fields.price)
          ? fields.price[0]
          : fields.price;

        const rawStock = Array.isArray(fields.stock)
          ? fields.stock[0]
          : fields.stock;

        const price = Number(rawPrice);
        const stock = Number(rawStock);

        // 🔥 VALIDASI TIDAK BOLEH MINUS
        if (price < 0 || stock < 0) {
          return res.status(400).json({
            message: "Harga dan stok tidak boleh minus",
          });
        }

        let dataToUpdate = {
          name,
          price,
          stock,
        };

        // Kalau upload gambar baru
        if (files.image && files.image[0]) {
          const imageFile = files.image[0];

          const uploadDir = path.join(
            process.cwd(),
            "public/uploads"
          );

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const fileName =
            Date.now() + "-" + imageFile.originalFilename;

          fs.copyFileSync(
            imageFile.filepath,
            path.join(uploadDir, fileName)
          );

          dataToUpdate.image = `/uploads/${fileName}`;
        }

        const updatedProduct = await prisma.product.update({
          where: { id },
          data: dataToUpdate,
        });

        return res.status(200).json(updatedProduct);
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Gagal update produk" });
      }
    });

    return;
  }

  // ======================
// DELETE PRODUCT
// ======================
if (req.method === "DELETE") {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    // 🔥 CEK STOK
    if (product.stock > 0) {
      return res.status(400).json({
        message:
          "Stok produk masih tersedia. Menghapus produk ini bisa menyebabkan kerugian.",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Produk berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal hapus produk",
    });
  }
}


  res.status(405).json({ message: "Method not allowed" });
}
