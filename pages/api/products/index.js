import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ======================
  // GET → SEMUA USER
  // ======================
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(products);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal ambil produk" });
    }
  }

  

  res.status(405).json({ message: "Method not allowed" });
}
