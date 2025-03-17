
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Loader2, InfoIcon, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useHydro } from '@/contexts/HydroContext';
import QRCodeScanner from '@/components/QRCodeScanner';

const DeviceWifiSetup = () => {
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { devices, updateDevice } = useHydro();
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const location = useLocation();
  
  // Find the device in our context
  const device = devices.find(d => d.id === deviceId);
  
  // Check for connected device
  useEffect(() => {
    // Simulate device detection - in real implementation, check if device is in pairing mode
    const checkDeviceConnection = async () => {
      try {
        // For real implementation, check for server availability
        const response = await fetch('http://localhost:3001/api/scan-wifi', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Set a short timeout for the request
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          setDeviceConnected(true);
        } else {
          setDeviceConnected(false);
        }
      } catch (error) {
        console.error('Error checking device connection:', error);
        setDeviceConnected(false);
      }
    };
    
    checkDeviceConnection();
  }, []);

  // If device already has WiFi config, use it
  useEffect(() => {
    if (device?.wifiConfig) {
      setWifiSSID(device.wifiConfig.wifiSSID);
      if (device.wifiConfig.wifiPassword) {
        setWifiPassword(device.wifiConfig.wifiPassword);
      }
    }
  }, [device]);

  const handleWifiConnect = (ssid: string, password: string) => {
    setWifiSSID(ssid);
    setWifiPassword(password);
    toast.success(`Wi-Fi credentials saved: ${ssid}`);
  };

  const handleSaveWifiConfig = async () => {
    if (!deviceId || !wifiSSID) {
      toast.error('Device ID or WiFi SSID is missing');
      return;
    }

    try {
      setIsConfiguring(true);
      
      // Update device with WiFi configuration
      await updateDevice(deviceId, {
        wifiConfig: {
          wifiSSID,
          wifiPassword
        }
      });
      
      toast.success('WiFi configuration saved successfully!');
      navigate(`/devices/${deviceId}/code`);
    } catch (error) {
      console.error('Error saving WiFi configuration:', error);
      toast.error('Failed to save WiFi configuration');
    } finally {
      setIsConfiguring(false);
    }
  };

  // If device not found
  if (!device) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="mb-8 bg-amber-50 border-amber-200">
          <InfoIcon className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-800">Device not found</AlertTitle>
          <AlertDescription className="text-amber-700">
            The device you're trying to configure doesn't exist or has been deleted.
          </AlertDescription>
        </Alert>
        
        <Button
          onClick={() => navigate('/devices')}
          className="bg-hydro-blue hover:bg-blue-700"
        >
          Back to Devices
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Configure Wi-Fi for {device.name}</h1>
        <p className="text-gray-600 mt-2">
          Scan a Wi-Fi QR code to configure your {device.type.toUpperCase()} device.
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-hydro-blue text-white rounded-full flex items-center justify-center mb-1">
            <Check className="h-5 w-5" />
          </div>
          <span className="text-xs text-gray-600">Create Device</span>
        </div>
        <div className="h-0.5 flex-1 bg-hydro-blue mx-2"></div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-hydro-blue text-white rounded-full flex items-center justify-center mb-1">
            2
          </div>
          <span className="text-xs text-gray-600 font-medium">Configure Wi-Fi</span>
        </div>
        <div className="h-0.5 flex-1 bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-1">
            3
          </div>
          <span className="text-xs text-gray-500">Get Code</span>
        </div>
      </div>
      
      {/* QR Code Scanner Component */}
      <QRCodeScanner 
        onConnect={handleWifiConnect} 
        serverConnected={deviceConnected} 
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Finish Wi-Fi Setup</CardTitle>
          <CardDescription>
            Review the Wi-Fi settings and continue to get your device code
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {wifiSSID ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800 flex items-center">
                <Check className="h-4 w-4 mr-1.5 text-green-600" />
                Wi-Fi Configured
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Your device will connect to: <strong>{wifiSSID}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1">
                These credentials will be embedded in your device code.
              </p>
            </div>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <InfoIcon className="h-5 w-5 text-amber-500" />
              <AlertDescription className="text-amber-700">
                Please scan a Wi-Fi QR code to continue.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate('/devices')}
          >
            Cancel
          </Button>
          <Button
            className="bg-hydro-blue hover:bg-blue-700"
            disabled={!wifiSSID || isConfiguring}
            onClick={handleSaveWifiConfig}
          >
            {isConfiguring ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Device Code
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeviceWifiSetup;
