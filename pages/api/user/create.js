import prisma from "../../../lib/prisma";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, role } = req.body;

  // validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    // hash password
    const hashedPassword = await hash(password, 10);

    // simpan user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });

    // jangan balikin password
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal membuat user" });
  }
}
