import { copyFile, mkdir, rm, unlink } from "node:fs/promises";
import { constants } from "node:fs";

// La ruta existe solo durante estas pruebas, nunca en la compilación de producción.
export default async function prepararCabeceras() {
  const directorio = new URL("../../app/(portal)/componentes/cabeceras/", import.meta.url);
  const destino = new URL("page.tsx", directorio);
  await mkdir(directorio, { recursive: true });
  await copyFile(new URL("../fixtures/cabeceras.tsx", import.meta.url), destino, constants.COPYFILE_EXCL);
  return async () => {
    await unlink(destino);
    // Next conserva el tipo de la ruta temporal y rompería una compilación posterior.
    await rm(new URL("../../.next/dev/types/app/(portal)/componentes/cabeceras/page.ts", import.meta.url), { force: true });
  };
}
