import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Cloud, Thermometer, Droplets, Wind, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export function UserDashboard() {
  const { user } = useAuth();
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [sendingReport, setSendingReport] = useState(false);
  const [reportResult, setReportResult] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      if (!user?.city) return;
      try {
        setLoadingWeather(true);
        const data = await api.getCurrentWeather();
        setWeather(data);
      } catch (e) {
        console.error('Failed to fetch weather', e);
      } finally {
        setLoadingWeather(false);
      }
    }
    fetchWeather();
  }, [user]);

  const handleSendTest = async () => {
    setSendingTest(true);
    setTestResult(null);
    setReportResult(null);
    try {
      const res = await api.sendTelegramTestMessage();
      if (res.sent) {
        setTestResult({ success: true, message: 'Test message sent! Check Telegram.' });
      } else {
        setTestResult({ success: false, message: res.message || 'Failed to send test message.' });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'An error occurred while sending test message.' });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendReport = async () => {
    setSendingReport(true);
    setTestResult(null);
    setReportResult(null);
    try {
      const res = await api.sendTelegramWeatherReport();
      if (res.sent) {
        setReportResult({ success: true, message: 'Weather report sent! Check Telegram.' });
      } else {
        setReportResult({ success: false, message: res.message || 'Failed to send weather report.' });
      }
    } catch (err) {
      setReportResult({ success: false, message: 'An error occurred while sending weather report.' });
    } finally {
      setSendingReport(false);
    }
  };

  // Convert frequency enum to readable string
  const formatFrequency = (freq?: string) => {
    if (!freq) return 'Not Configured';
    return freq.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Welcome back, {user?.name}
        </h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Monitor your local weather and manage Telegram alerts.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Panel: Weather display (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-white/60 bg-gradient-to-br from-white/40 to-slate-50/20 backdrop-blur-md p-6 shadow-sm min-h-[320px]">
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Cloud size={20} className="text-blue-500" />
                Current Weather
              </h3>
              {user?.city && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  <MapPin size={12} /> {user.city}, {user.country}
                </span>
              )}
            </div>

            {loadingWeather ? (
              <div className="flex flex-col justify-center items-center py-16 gap-3">
                <Loader2 className="animate-spin text-blue-500" size={36} />
                <span className="text-sm font-medium text-slate-400">Loading weather data...</span>
              </div>
            ) : weather ? (
              <div className="space-y-8">
                {/* Main Temperature & Condition Display */}
                <div className="flex items-center justify-between bg-white/30 rounded-2xl p-6 border border-white/50">
                  <div>
                    <div className="text-5xl font-extrabold text-slate-800 tracking-tight">
                      {Math.round(weather.main?.temp)}°C
                    </div>
                    <div className="text-base font-semibold text-slate-700 capitalize mt-1">
                      {weather.weather?.[0]?.description}
                    </div>
                  </div>
                  {weather.weather?.[0]?.icon && (
                    <div className="bg-blue-500/10 p-2 rounded-2xl border border-blue-500/20">
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                        alt={weather.weather[0].description} 
                        className="w-20 h-20 drop-shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Sub Metrics Grid */}
                <div className="grid gap-4 grid-cols-3">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/50 rounded-xl border border-white/60">
                    <Thermometer size={24} className="text-orange-500 mb-2" />
                    <div className="text-sm font-extrabold text-slate-800">
                      {typeof weather.main?.temp_max === 'number' && typeof weather.main?.temp_min === 'number'
                        ? `${Math.round(weather.main.temp_max)}°C / ${Math.round(weather.main.temp_min)}°C`
                        : '--'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Range</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/50 rounded-xl border border-white/60">
                    <Droplets size={24} className="text-blue-500 mb-2" />
                    <div className="text-lg font-extrabold text-slate-800">{weather.main?.humidity}%</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Humidity</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/50 rounded-xl border border-white/60">
                    <Wind size={24} className="text-teal-500 mb-2" />
                    <div className="text-lg font-extrabold text-slate-800">{weather.wind?.speed} m/s</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Wind Speed</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-16 font-medium">
                Unable to load weather metrics. Please verify your profile settings.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Account Details & Control Panel (1/3 width) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Card 1: Account Details & Alert Preferences */}
          <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Details</h3>
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-slate-800">{user?.name}</span>
                <span className="text-xs text-slate-500 font-medium">{user?.email}</span>
              </div>
            </div>

            <div className="border-t border-white/40 pt-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Access Level</span>
                <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 uppercase text-[10px] font-bold">
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Target Location</span>
                <span className="text-slate-800 font-bold">{user?.city}, {user?.country}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Alert Frequency</span>
                <span className="text-slate-800 font-bold">{formatFrequency(user?.alertFrequency)}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Telegram connection status */}
          <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Telegram Status</h3>
              <div className="flex items-center gap-3 bg-white/50 border border-white/60 rounded-xl p-3">
                <div className={`h-2.5 w-2.5 rounded-full ${user?.telegramConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <div>
                  <div className="text-xs font-extrabold text-slate-800">
                    {user?.telegramConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500">
                    {user?.telegramConnected ? 'Receiving real-time alerts' : 'Configure Telegram to receive alerts'}
                  </div>
                </div>
              </div>
            </div>

            {user?.telegramConnected && (
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSendTest}
                  disabled={sendingTest || sendingReport}
                  className="w-full h-9 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 disabled:bg-slate-300 transition-colors border border-slate-200 shadow-sm"
                >
                  {sendingTest ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Sending Test...
                    </>
                  ) : (
                    'Send Test Alert'
                  )}
                </button>
                <button
                  onClick={handleSendReport}
                  disabled={sendingTest || sendingReport}
                  className="w-full h-9 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 transition-colors shadow-sm"
                >
                  {sendingReport ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Sending Report...
                    </>
                  ) : (
                    'Send Weather Report'
                  )}
                </button>
                {(testResult || reportResult) && (
                  <p className={`text-[10px] font-semibold mt-2 text-center ${(testResult?.success || reportResult?.success) ? 'text-green-600' : 'text-red-500'}`}>
                    {testResult?.message || reportResult?.message}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
