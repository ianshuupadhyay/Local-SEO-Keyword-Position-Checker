const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runScript: (formData) => ipcRenderer.invoke('run-script', formData),
});
