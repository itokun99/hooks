import { useCallback } from "react";

export function useDownload() {
  const downloadFile = useCallback(
    (data: BlobPart, filename: string, mimeType: string) => {
      // Membuat blob dari data yang diberikan
      const blob = new Blob([data], { type: mimeType });

      // Membuat URL untuk blob
      const url = window.URL.createObjectURL(blob);

      // Membuat elemen anchor untuk memulai download
      const element = document.createElement("a");
      element.href = url;
      element.download = filename; // Tentukan nama file untuk disimpan
      document.body.appendChild(element); // Menambahkan elemen ke dokumen untuk memastikan dapat berfungsi di semua browser

      // Klik elemen untuk memulai download
      element.click();

      // Bersihkan dan hapus URL dan elemen setelah download dimulai
      window.URL.revokeObjectURL(url);
      document.body.removeChild(element);
    },
    [],
  );

  return {
    downloadFile,
  };
}
