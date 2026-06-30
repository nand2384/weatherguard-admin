import { useState, useEffect, useRef } from 'react';
import { CloudLightning, CheckCircle2, RefreshCw, Search, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { fetchClient } from '../services/apiClient';
import { api } from '../services/api';
import type { GeocodeResult } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { AlertFrequency } from '../types';

export function CompleteProfile() {
  const { user, refreshUser } = useAuth();
  
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [latitude, setLatitude] = useState(user?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(user?.longitude?.toString() || '');
  const [alertFrequency, setAlertFrequency] = useState<AlertFrequency>(user?.alertFrequency || 'SEVERE_ONLY');
  
  const [step, setStep] = useState(user?.telegramConnected ? 2 : 1);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState(user?.city || '');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCity(query);
    setShowDropdown(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await api.searchCities(query);
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to search cities', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectCity = (result: GeocodeResult) => {
    setCity(result.name);
    setSearchQuery(`${result.name}, ${result.country}`);
    setCountry(result.country);
    setLatitude(result.lat.toString());
    setLongitude(result.lon.toString());
    setShowDropdown(false);
  };

  const handleSaveProfile = async () => {
    setIsSubmittingProfile(true);
    try {
      await fetchClient.patch('/users/profile', {
        city,
        country,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        alertFrequency,
      });
      await refreshUser();
      setStep(2);
    } catch (e) {
      console.error(e);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleConnectTelegram = async () => {
    try {
      const response = await fetchClient.get<{ url: string }>('/telegram/connect');
      if (response.url) {
        // Try opening in a new tab first (great for desktop users)
        const newWindow = window.open(response.url, '_blank');
        // If popup was blocked or couldn't open (common on mobile phone browsers), redirect the current tab directly
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          window.location.href = response.url;
        }
      }
    } catch (e) {
      console.error(e);
      alert('Failed to get Telegram connect URL.');
    }
  };

  const handleRefreshStatus = async () => {
    await refreshUser();
  };

  const handleSubmitAccess = async () => {
    setIsRequestingAccess(true);
    try {
      await fetchClient.post('/users/request-access');
      await refreshUser(); // This will change approvalStatus to PENDING and trigger route change
    } catch (e) {
      console.error(e);
      alert('Failed to submit request.');
      setIsRequestingAccess(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl w-full max-w-lg p-8 sm:p-10 flex flex-col shadow-2xl relative mx-auto my-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-sm text-white mb-4">
          <CloudLightning size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Complete Profile
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          {step === 1 ? 'Set up your location and alert preferences' : 'Connect Telegram to finish your setup'}
        </p>
      </div>

      <div className="space-y-6">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City Search</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search for a city..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/60 bg-white/40 backdrop-blur-md text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:bg-white shadow-sm transition-all"
                  />
                  {isSearching && (
                    <Loader2 size={16} className="absolute right-3 top-3.5 text-slate-400 animate-spin" />
                  )}
                </div>
                
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-lg max-h-60 overflow-auto overflow-x-hidden">
                    {searchResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 hover:bg-slate-50/80 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                        onClick={() => handleSelectCity(result)}
                      >
                        <div className="text-sm font-semibold text-slate-800">{result.name}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {result.state ? `${result.state}, ` : ''}{result.country} 
                          <span className="ml-2 text-slate-400 font-mono">[{result.lat.toFixed(2)}, {result.lon.toFixed(2)}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showDropdown && searchQuery && !isSearching && searchResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-lg p-4 text-center text-sm text-slate-500">
                    No cities found.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
                <input
                  type="text"
                  value={country}
                  readOnly
                  placeholder="Auto-filled"
                  className="w-full h-11 px-4 rounded-xl border border-white/60 bg-slate-50/50 backdrop-blur-md text-sm text-slate-500 shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  readOnly
                  placeholder="Auto-filled"
                  className="w-full h-11 px-4 rounded-xl border border-white/60 bg-slate-50/50 backdrop-blur-md text-sm text-slate-500 shadow-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  readOnly
                  placeholder="Auto-filled"
                  className="w-full h-11 px-4 rounded-xl border border-white/60 bg-slate-50/50 backdrop-blur-md text-sm text-slate-500 shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alert Frequency</label>
              <select
                value={alertFrequency}
                onChange={(e) => setAlertFrequency(e.target.value as AlertFrequency)}
                className="w-full h-11 px-4 rounded-xl border border-white/60 bg-white/40 backdrop-blur-md text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:bg-white shadow-sm transition-all appearance-none"
              >
                <option value="EVERY_HOUR">Every Hour</option>
                <option value="EVERY_3_HOURS">Every 3 Hours</option>
                <option value="EVERY_6_HOURS">Every 6 Hours</option>
                <option value="SEVERE_ONLY">Severe Weather Only</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-semibold mt-6 shadow-md"
              onClick={handleSaveProfile}
              disabled={isSubmittingProfile || !city || !country || !latitude || !longitude}
            >
              {isSubmittingProfile ? 'Saving...' : 'Continue to Telegram'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-tight text-slate-800">Telegram Connection</h3>
            
            <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-5 shadow-sm space-y-4">
              <p className="text-sm text-slate-500 font-medium">
                1. Click the button below to open Telegram.<br/>
                2. Start the bot and follow the prompts to link your account.<br/>
                3. Return to this page and click "Refresh Status".
              </p>
              
              {user?.telegramConnected ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50/50 p-3 rounded-xl border border-green-100">
                  <CheckCircle2 size={18} />
                  Telegram Connected
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm font-semibold bg-white/60 hover:bg-white border-slate-300"
                    onClick={handleConnectTelegram}
                  >
                    Open Telegram
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
                    onClick={handleRefreshStatus}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh Status
                  </Button>
                </div>
              )}
            </div>

            <hr className="border-t border-slate-200/60" />

            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-semibold shadow-md"
              onClick={handleSubmitAccess}
              disabled={!user?.telegramConnected || isRequestingAccess}
            >
              {isRequestingAccess ? 'Submitting...' : 'Submit Access Request'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
