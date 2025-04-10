const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load built React app
  win.loadFile(path.join(__dirname, '../build/index.html'));

  // Fires after index.html is loaded
  win.webContents.on('did-finish-load', () => {
    console.log('✅ App finished loading!');
  });

  // Fires when a page fails to load (e.g., index.html)
  win.webContents.on('did-fail-load', (event, code, desc, url) => {
    console.error(`❌ Failed to load: ${url}`);
    console.error(`   ${desc} (code ${code})`);
  });

  // Captures console logs from the frontend
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`🪵 [Console:${level}] ${message} (${sourceId}:${line})`);
  });
}

// ✅ Hook into web requests BEFORE window is created
function setupRequestLogging() {
  const filter = { urls: ['*://*/*'] };

  session.defaultSession.webRequest.onCompleted(filter, (details) => {
    const { method, url, statusCode } = details;
    console.log(`📦 [${method}] ${url} - ${statusCode}`);
  });

  session.defaultSession.webRequest.onErrorOccurred(filter, (details) => {
    console.error(`❌ Failed request to: ${details.url}`);
    console.error(`   Error: ${details.error}`);
  });
}

app.whenReady().then(() => {
  setupRequestLogging();  // 👈 Ensure this runs first
  createWindow();         // 👈 Then create the window
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
