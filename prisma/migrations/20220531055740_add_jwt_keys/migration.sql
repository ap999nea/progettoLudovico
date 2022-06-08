-- CreateTable
CREATE TABLE "JwtKeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL
);
