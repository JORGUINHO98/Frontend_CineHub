@echo off
echo 🎬 Actualizando CineHub Frontend a Expo SDK 54...

echo 🧹 Limpiando dependencias anteriores...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 🧽 Limpiando cache de npm...
npm cache clean --force

echo 📦 Instalando nuevas dependencias (sin @expo/webpack-config)...
npm install --legacy-peer-deps

echo 🔄 Limpiando cache de Expo...
npx expo start --clear

echo ✅ ¡Actualización completada!
echo 🌐 La aplicación debería estar funcionando ahora
echo 📱 Escanea el código QR con Expo Go (SDK 54)
echo ⚠️  Nota: @expo/webpack-config fue removido (obsoleto en SDK 54)
pause
