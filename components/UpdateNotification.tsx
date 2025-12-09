import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface UpdateStatus {
    status: 'checking' | 'available' | 'not_available' | 'downloading' | 'downloaded' | 'error';
    info?: any;
    progress?: {
        percent: number;
        transferred: number;
        total: number;
        bytesPerSecond: number;
    };
    error?: string;
}

const UpdateNotification: React.FC = () => {
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if electronAPI is available (it won't be in pure browser mode)
        if (window.electronAPI) {
            window.electronAPI.onUpdateStatus((status: UpdateStatus) => {
                console.log('Update status:', status);
                setUpdateStatus(status);
                if (['available', 'downloading', 'downloaded', 'error'].includes(status.status)) {
                    setIsVisible(true);
                }
            });
        }
    }, []);

    if (!isVisible || !updateStatus) return null;

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleRestart = () => {
        if (window.electronAPI) {
            window.electronAPI.restartApp();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {updateStatus.status === 'available' && <Download className="h-6 w-6 text-blue-400" />}
                        {updateStatus.status === 'downloading' && <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />}
                        {updateStatus.status === 'downloaded' && <CheckCircle className="h-6 w-6 text-green-400" />}
                        {updateStatus.status === 'error' && <AlertTriangle className="h-6 w-6 text-red-400" />}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {updateStatus.status === 'available' && 'Update Available'}
                            {updateStatus.status === 'downloading' && 'Downloading Update...'}
                            {updateStatus.status === 'downloaded' && 'Update Ready'}
                            {updateStatus.status === 'error' && 'Update Error'}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {updateStatus.status === 'available' && 'A new version is available. Downloading now...'}
                            {updateStatus.status === 'downloading' && updateStatus.progress && (
                                `Progress: ${Math.round(updateStatus.progress.percent)}%`
                            )}
                            {updateStatus.status === 'downloaded' && 'Restart the app to apply the update.'}
                            {updateStatus.status === 'error' && updateStatus.error}
                        </p>
                        {updateStatus.status === 'downloaded' && (
                            <div className="mt-3 flex space-x-7">
                                <button
                                    type="button"
                                    onClick={handleRestart}
                                    className="bg-white dark:bg-gray-800 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Restart Now
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="bg-white dark:bg-gray-800 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Later
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotification;
