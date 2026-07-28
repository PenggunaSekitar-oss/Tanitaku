# Tanita Operations

Aplikasi operasional pertanian berbasis React dan Vite. Data kebun, tanaman,
aktivitas, jadwal, serta keuangan disimpan secara lokal pada perangkat pengguna.

## Menjalankan secara lokal

Prasyarat: Node.js 20 atau versi LTS yang lebih baru.

```bash
npm ci
npm run dev
```

Aplikasi tersedia di `http://localhost:3000`.

## Pemeriksaan kualitas

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

## Catatan keamanan

Gerbang akses aplikasi hanya melindungi penggunaan normal pada browser lokal.
Gerbang ini bukan autentikasi server dan tidak boleh dipakai untuk melindungi data
rahasia. Untuk kontrol akun atau lisensi yang kuat, gunakan autentikasi dan
otorisasi di backend.
