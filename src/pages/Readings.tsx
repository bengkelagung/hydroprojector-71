
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplet, 
  ThermometerIcon, 
  AlertTriangle, 
  Cloud, 
  LightbulbIcon, 
  Waves, 
  Flower, 
  Power,
  BarChart4
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useHydro, Pin } from '@/contexts/HydroContext';
import { Button } from '@/components/ui/button';
import PinDetailsDialog from '@/components/PinDetailsDialog';
import { checkLabelColumnExists } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

const Readings = () => {
  const { pins, devices, projects, togglePinValue } = useHydro();
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isPinDetailsOpen, setIsPinDetailsOpen] = useState(false);
  const [hasLabelColumn, setHasLabelColumn] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if label column exists
    const checkColumn = async () => {
      const exists = await checkLabelColumnExists();
      setHasLabelColumn(exists);
    };
    
    checkColumn();
  }, []);

  // Get all pins
  const inputPins = pins.filter(p => p.mode === 'input');
  const outputPins = pins.filter(p => p.mode === 'output');

  // Calculate some summary statistics
  const totalSensors = inputPins.length;
  const totalControls = outputPins.length;
  const connectedDevices = devices.filter(d => d.isConnected).length;
  const totalDevices = devices.length;

  const handleOpenPinDetails = (pin: Pin) => {
    setSelectedPin(pin);
    setIsPinDetailsOpen(true);
  };

  const handleToggleOutput = (pin: Pin) => {
    togglePinValue(pin.id);
  };

  // Helper function to get an icon based on label or signal type
  const getPinIcon = (pin: Pin) => {
    const label = pin.label || '';
    const signalType = pin.signalType;
    
    switch (label.toLowerCase()) {
      case 'ph':
        return <Droplet className="h-5 w-5 mr-2 text-purple-500" />;
      case 'suhu':
        return <ThermometerIcon className="h-5 w-5 mr-2 text-orange-500" />;
      case 'kelembaban':
        return <Cloud className="h-5 w-5 mr-2 text-blue-500" />;
      case 'lampu':
        return <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-500" />;
      case 'pompa':
        return <Power className="h-5 w-5 mr-2 text-green-500" />;
      case 'level air':
        return <Waves className="h-5 w-5 mr-2 text-cyan-500" />;
      default:
        // Fallback to signal type if no label
        switch (signalType) {
          case 'pH': return <Droplet className="h-5 w-5 mr-2 text-purple-500" />;
          case 'temperature': return <ThermometerIcon className="h-5 w-5 mr-2 text-orange-500" />;
          case 'humidity': return <Cloud className="h-5 w-5 mr-2 text-blue-500" />;
          case 'water-level': return <Waves className="h-5 w-5 mr-2 text-cyan-500" />;
          case 'light': return <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-500" />;
          default: return <Activity className="h-5 w-5 mr-2 text-gray-500" />;
        }
    }
  };

  // Helper function to get a color based on label or signal type
  const getPinColor = (pin: Pin) => {
    const label = pin.label?.toLowerCase() || '';
    const signalType = pin.signalType;
    
    switch (label) {
      case 'ph': return 'bg-purple-500';
      case 'suhu': return 'bg-orange-500';
      case 'kelembaban': return 'bg-blue-500';
      case 'lampu': return 'bg-yellow-500';
      case 'pompa': return 'bg-green-500';
      case 'level air': return 'bg-cyan-500';
      default:
        // Fallback to signal type if no label
        switch (signalType) {
          case 'pH': return 'bg-purple-500';
          case 'temperature': return 'bg-orange-500';
          case 'humidity': return 'bg-blue-500';
          case 'water-level': return 'bg-cyan-500';
          case 'light': return 'bg-yellow-500';
          default: return 'bg-gray-500';
        }
    }
  };

  // Get visual indicator component based on pin type and value
  const getVisualIndicator = (pin: Pin, value: string) => {
    const label = pin.label?.toLowerCase() || '';
    const signalType = pin.signalType;
    
    // pH indicator
    if (label === 'ph' || signalType === 'pH') {
      return (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${parseFloat(value) < 6 ? 'bg-red-500' : parseFloat(value) > 7 ? 'bg-purple-500' : 'bg-green-500'}`} 
            style={{ width: `${(parseFloat(value) / 14) * 100}%` }}
          ></div>
        </div>
      );
    }
    
    // Temperature indicator
    if (label === 'suhu' || signalType === 'temperature') {
      return (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${parseFloat(value) < 18 ? 'bg-blue-500' : parseFloat(value) > 28 ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${(parseFloat(value) / 40) * 100}%` }}
          ></div>
        </div>
      );
    }
    
    // Humidity, Water Level indicators
    if (label === 'kelembaban' || label === 'level air' || signalType === 'humidity' || signalType === 'water-level') {
      return (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${parseFloat(value) < 30 ? 'bg-red-500' : parseFloat(value) < 60 ? 'bg-amber-500' : 'bg-green-500'}`} 
            style={{ width: `${parseFloat(value)}%` }}
          ></div>
        </div>
      );
    }
    
    // For on/off types (like Lampu/light or Pompa/pump)
    if (label === 'lampu' || label === 'pompa' || signalType === 'light' || signalType === 'digital') {
      const isOn = value === '1' || value.toLowerCase() === 'on' || value.toLowerCase() === 'true';
      return (
        <div className="w-16 h-8 relative rounded-full bg-gray-200">
          <div className={`absolute inset-0 rounded-full transition-colors ${isOn ? 'bg-green-500' : 'bg-gray-400'}`}>
            <div className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-8' : 'translate-x-1'} top-1`} />
          </div>
        </div>
      );
    }
    
    // Default indicator for other types
    return (
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500" 
          style={{ width: `${(parseFloat(value) / 100) * 100}%` }}
        ></div>
      </div>
    );
  };

  // Helper to get alert status based on pin type and value
  const getAlertStatus = (pin: Pin, value: string) => {
    const label = pin.label?.toLowerCase() || '';
    const signalType = pin.signalType;
    
    if (label === 'ph' || signalType === 'pH') {
      return parseFloat(value) < 5.5 || parseFloat(value) > 7.5;
    }
    
    if (label === 'suhu' || signalType === 'temperature') {
      return parseFloat(value) < 18 || parseFloat(value) > 28;
    }
    
    if (label === 'kelembaban' || signalType === 'humidity') {
      return parseFloat(value) < 40 || parseFloat(value) > 90;
    }
    
    if (label === 'level air' || signalType === 'water-level') {
      return parseFloat(value) < 40;
    }
    
    return false;
  };

  // Generate mock value for demo purposes if none exists
  const getMockValue = (pin: Pin) => {
    const label = pin.label?.toLowerCase() || '';
    const signalType = pin.signalType;
    
    if (label === 'ph' || signalType === 'pH') {
      return (5.5 + Math.random() * 2).toFixed(1);
    }
    
    if (label === 'suhu' || signalType === 'temperature') {
      return (20 + Math.random() * 8).toFixed(1);
    }
    
    if (label === 'kelembaban' || signalType === 'humidity') {
      return (50 + Math.random() * 30).toFixed(1);
    }
    
    if (label === 'level air' || signalType === 'water-level') {
      return (70 + Math.random() * 30).toFixed(1);
    }
    
    if (label === 'lampu' || label === 'pompa' || signalType === 'digital') {
      return Math.random() > 0.5 ? '1' : '0';
    }
    
    return Math.floor(Math.random() * 100).toString();
  };

  // Get the appropriate unit based on pin type
  const getUnit = (pin: Pin) => {
    const label = pin.label?.toLowerCase() || '';
    const signalType = pin.signalType;
    
    if (label === 'suhu' || signalType === 'temperature') {
      return '°C';
    }
    
    if (label === 'kelembaban' || label === 'level air' || signalType === 'humidity' || signalType === 'water-level') {
      return '%';
    }
    
    if (label === 'lampu' || label === 'pompa') {
      return '';
    }
    
    return pin.unit || '';
  };

  // Format the display value based on pin type
  const getDisplayValue = (pin: Pin, value: string) => {
    const label = pin.label?.toLowerCase() || '';
    
    if (label === 'lampu' || label === 'pompa') {
      return value === '1' || value.toLowerCase() === 'on' || value.toLowerCase() === 'true' ? 'ON' : 'OFF';
    }
    
    return `${value}${getUnit(pin)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Sensor Readings Dashboard</h2>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Input Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-500 mr-2" />
              </div>
              <div className="text-2xl font-bold">{totalSensors}</div>
            </div>
            <CardDescription className="mt-2">Total sensor inputs configured</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Output Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Power className="h-8 w-8 text-green-500 mr-2" />
              </div>
              <div className="text-2xl font-bold">{totalControls}</div>
            </div>
            <CardDescription className="mt-2">Total output controls configured</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart4 className="h-8 w-8 text-indigo-500 mr-2" />
              </div>
              <div className="text-2xl font-bold">{connectedDevices}/{totalDevices}</div>
            </div>
            <CardDescription className="mt-2">Active monitoring devices</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Alert Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mr-2" />
              </div>
              <div className="text-2xl font-bold">
                {inputPins.filter(p => getAlertStatus(p, p.value || getMockValue(p))).length}
              </div>
            </div>
            <CardDescription className="mt-2">Sensors requiring attention</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {inputPins.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4 inline-flex p-3 bg-gray-100 rounded-full">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No sensor data yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Configure your device pins to start collecting sensor data.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Sensor Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {inputPins.map(pin => {
              const device = devices.find(d => d.id === pin.deviceId);
              const project = device ? projects.find(p => p.id === device.projectId) : null;
              
              const value = pin.value || getMockValue(pin);
              const alert = getAlertStatus(pin, value);
              
              const colorClass = getPinColor(pin);
              
              return (
                <Card key={pin.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className={`bg-opacity-10 ${colorClass.replace('bg-', 'bg-opacity-10 bg-')}`}>
                    <div className="flex items-center">
                      {getPinIcon(pin)}
                      <CardTitle className="capitalize">{pin.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {pin.label || pin.signalType.charAt(0).toUpperCase() + pin.signalType.slice(1)}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {device?.name} • {project?.name}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {alert && (
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                            )}
                            <span className={`text-lg font-semibold ${alert ? 'text-amber-500' : 'text-gray-800'}`}>
                              {getDisplayValue(pin, value)}
                            </span>
                          </div>
                        </div>
                        
                        {getVisualIndicator(pin, value)}
                        
                        <div className="mt-2">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => handleOpenPinDetails(pin)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        
          {outputPins.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-3">Control Outputs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {outputPins.map(pin => {
                  const device = devices.find(d => d.id === pin.deviceId);
                  const project = device ? projects.find(p => p.id === device.projectId) : null;
                  
                  const value = pin.value || '0';
                  const isOn = value === '1' || value.toLowerCase() === 'on' || value.toLowerCase() === 'true';
                  
                  const colorClass = getPinColor(pin);
                  
                  return (
                    <Card key={pin.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className={`bg-opacity-10 ${colorClass.replace('bg-', 'bg-opacity-10 bg-')}`}>
                        <div className="flex items-center">
                          {getPinIcon(pin)}
                          <CardTitle className="capitalize">{pin.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="pb-4">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {pin.label || pin.signalType.charAt(0).toUpperCase() + pin.signalType.slice(1)}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {device?.name} • {project?.name}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span className={`text-sm font-medium ${isOn ? 'text-green-500' : 'text-gray-400'}`}>
                                  {isOn ? 'ON' : 'OFF'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <Button 
                                variant="outline" 
                                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => handleOpenPinDetails(pin)}
                              >
                                Details
                              </Button>
                              
                              <Button
                                onClick={() => handleToggleOutput(pin)}
                                variant={isOn ? "destructive" : "default"}
                                size="sm"
                              >
                                {isOn ? 'Turn Off' : 'Turn On'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Pin Details Dialog */}
      <PinDetailsDialog 
        open={isPinDetailsOpen}
        onOpenChange={setIsPinDetailsOpen}
        pin={selectedPin}
      />
    </div>
  );
};

export default Readings;
