const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateStatus: (callback) => ipcRenderer.on('update_status', (_event, value) => callback(value)),
    restartApp: () => ipcRenderer.invoke('restart_app'),
});
