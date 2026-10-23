// Tipos de Expo (incluye el import de .css). El expo-env.d.ts que genera `expo start` está en el
// .gitignore y no existe en CI ni en un clon nuevo: sin esto, `tsc` rechaza import "@/global.css".
/// <reference types="expo/types" />
