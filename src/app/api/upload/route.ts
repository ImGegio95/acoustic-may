import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "Nessun file ricevuto." }, { status: 400 });
    }

    // Convertiamo il file in byte raw per salvarlo su disco
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Destinazione: cartella public/uploads del server
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Assicuriamoci che la cartella esista, altrimenti la creiamo
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Se esiste già, va benissimo
    }

    // Puliamo il nome del file da spazi o caratteri strani e aggiungiamo la data per renderlo unico
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadDir, safeFilename);

    // Scrittura fisica su disco
    await writeFile(filepath, buffer);
    
    // Il link pubblico con cui sarà accessibile il file
    const fileUrl = `/uploads/${safeFilename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Errore durante l'upload del file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
