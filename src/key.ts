import { generateKeyPairSync } from "crypto";
import { prisma } from "./prisma";

export interface JwtKeys {
  privateKey: string;
  publicKey: string;
}

function generateKeys(): JwtKeys {
  //@ts-ignore
  const keys = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKey: {
      type: "pkcs8",
      format: "pem",
    },
  });
  return keys;
}

export async function getKwtKeys(): Promise<JwtKeys> {
  let keys = await prisma.jwtKeys.findFirst();
  if (!keys) {
    const genKeys = generateKeys();
    keys = await prisma.jwtKeys.create({
      data: {
        privateKey: genKeys.privateKey,
        publicKey: genKeys.publicKey,
      },
    });
  }
  return {
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  };
}
