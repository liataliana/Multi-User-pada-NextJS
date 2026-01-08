const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@google.com";
  const adminPassword = "12345678";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ Admin berhasil dibuat");
  } else {
    console.log("⚠️ Admin sudah ada");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
