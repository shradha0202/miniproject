import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, AlertCircle, Upload, KeyRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (serialId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [hasCameraError, setHasCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [manualSerialId, setManualSerialId] = useState('');

  const parseSerialFromText = (rawText: string): string => {
    // If it's a URL like http://localhost:5173/verify/UUID
    try {
      if (rawText.includes('/verify/')) {
        const parts = rawText.split('/verify/');
        return parts[1].split('?')[0].trim();
      }
    } catch (e) {
      // fallback
    }
    return rawText.trim();
  };

  const startScanner = async () => {
    setHasCameraError(false);
    setErrorMessage('');

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!videoDevices || videoDevices.length === 0) {
        setHasCameraError(true);
        setErrorMessage('No camera found on this device. You can enter the Serial ID manually or upload a QR image.');
        return;
      }

      // Prefer back camera if mobile
      const backCamera = videoDevices.find((device) =>
        device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')
      );
      const selectedDeviceId = backCamera ? backCamera.deviceId : videoDevices[0].deviceId;

      if (videoRef.current) {
        await reader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const serialId = parseSerialFromText(result.getText());
              // Stop camera and return
              stopScanner();
              onScanSuccess(serialId);
            }
          }
        );
      }
    } catch (err: any) {
      console.error('[QR Scanner Camera Error]', err);
      setHasCameraError(true);
      setErrorMessage(err.message || 'Camera permission denied or camera unavailable.');
    }
  };

  const stopScanner = () => {
    if (readerRef.current) {
      try {
        // ZXing controls
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {
        console.warn('Error closing stream:', e);
      }
      readerRef.current = null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new BrowserMultiFormatReader();
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        try {
          const result = await reader.decodeFromImageUrl(imageUrl);
          URL.revokeObjectURL(imageUrl);
          if (result) {
            stopScanner();
            onScanSuccess(parseSerialFromText(result.getText()));
          }
        } catch (err) {
          setHasCameraError(true);
          setErrorMessage('Could not find or decode a valid QR code in this image.');
        }
      };
    } catch (err: any) {
      setHasCameraError(true);
      setErrorMessage('Failed to read image file.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSerialId.trim()) {
      stopScanner();
      onScanSuccess(parseSerialFromText(manualSerialId));
    }
  };

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="qr-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="qr-modal-panel relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Scan Medicine QR Code</h3>
              <p className="text-xs text-neutral-400">Align QR code within the view finder frame</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Camera view */}
        <div className="my-4">
          {!hasCameraError ? (
            <div className="qr-camera-preview relative w-full aspect-square max-h-72 bg-black rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              {/* Scan Crosshairs */}
              <div className="absolute inset-8 border-2 border-emerald-500/60 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-emerald-400/80 shadow-[0_0_12px_#34d399] animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Camera Access Unavailable</p>
                <p className="text-xs text-amber-400/90 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Alternative options: Image Upload & Manual Serial ID */}
        <div className="space-y-4 pt-2 border-t border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Or choose an alternate method:</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload QR Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <form onSubmit={handleManualSubmit} className="flex min-w-0 gap-2">
            <div className="relative flex-1 min-w-0">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={manualSerialId}
                onChange={(e) => setManualSerialId(e.target.value)}
                placeholder="Enter Serial UUID or URL..."
                className="w-full min-w-0 pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!manualSerialId.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-black font-semibold text-sm rounded-lg transition-colors"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
