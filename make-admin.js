const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'chegembugu97@gmail.com';
  
  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (user) {
    // Update user to ADMIN
    user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log(`✅ Successfully updated ${email} to ADMIN role.`);
  } else {
    // Create new admin user
    user = await prisma.user.create({
      data: {
        email,
        role: 'ADMIN',
        fullName: 'Senior Admin',
      }
    });
    console.log(`✅ Successfully created new ADMIN user for ${email}.`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error setting admin role:', e.message);
    console.log('Make sure your DATABASE_URL is set in your .env file.');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
