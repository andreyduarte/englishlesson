const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Configure autoUpdater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Remove default menu for cleaner look (optional, comment out to debug)
    mainWindow.setMenuBarVisibility(false);

    // Load the app
    // In dev, load from localhost. In prod, load from index.html
    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        // Open DevTools in dev mode
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Open external links in default browser, not Electron
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    // Check for updates once the window is ready
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
};

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
    if (mainWindow) mainWindow.webContents.send('update_status', { status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
    if (mainWindow) mainWindow.webContents.send('update_status', { status: 'available', info });
    // We can choose to download automatically or ask the user. 
    // For now, let's start downloading automatically when available.
    autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', (info) => {
    if (mainWindow) mainWindow.webContents.send('update_status', { status: 'not_available', info });
});

autoUpdater.on('error', (err) => {
    if (mainWindow) mainWindow.webContents.send('update_status', { status: 'error', error: err.message });
});

autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) mainWindow.webContents.send('update_status', { status: 'downloading', progress: progressObj });
});

autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow) mainWindow.webContents.send('update_status', { status: 'downloaded', info });
});

// IPC handlers
ipcMain.handle('restart_app', () => {
    autoUpdater.quitAndInstall();
});

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
