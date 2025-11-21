const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Add any specific IPC methods here if needed in the future
    // For example:
    // setTitle: (title) => ipcRenderer.send('set-title', title)
});
