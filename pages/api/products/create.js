import prisma from "../../../lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({ message: "Form error" });
      }

      const name = fields.name[0];
      const price = Number(fields.price[0]);
      const stock = Number(fields.stock[0]);

      // 🔥 VALIDASI TIDAK BOLEH MINUS
      if (price < 0 || stock < 0) {
        return res.status(400).json({
          message: "Harga dan stok tidak boleh minus",
        });
      }

      const imageFile = files.image[0];

      if (!imageFile) {
        return res
          .status(400)
          .json({ message: "Image wajib" });
      }

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

      const product = await prisma.product.create({
        data: {
          name,
          price,
          stock,
          image: `/uploads/${fileName}`,
        },
      });

      return res.status(201).json(product);
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Server error",
      });
    }
  });
}
