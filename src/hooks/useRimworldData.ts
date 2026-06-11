import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchRimWorldData, setApiBaseUrl } from '../services/rimworldApi';
import { RimWorldData, Colonist } from '../types';

export const useRimWorldData = (
    apiUrl: string, 
    onGameStateChange: () => void,
    isAutoRefreshEnabled: boolean, // New Argument
    refreshSignal: number          // New Argument
) => {
    const [data, setData] = useState<RimWorldData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const hasLoadedDataOnce = useRef(false);
    // Under heavy RIMAPI load (e.g. an RLE agent run) the occasional poll comes
    // back with no colonists or a non-Playing state. Don't tear the dashboard
    // down to the loading screen on a single blip — require several consecutive
    // bad polls before signalling a real game-state change.
    const consecutiveBadPolls = useRef(0);
    const BAD_POLL_THRESHOLD = 3;

    // Set API Base URL whenever prop changes
    useEffect(() => {
        setApiBaseUrl(apiUrl);
    }, [apiUrl]);

    const loadData = useCallback(async () => {
        try {
            // Don't set loading to true on background refreshes to avoid UI flicker
            if (!hasLoadedDataOnce.current) setLoading(true); 
            
            const rimWorldData = await fetchRimWorldData();
            
            // Game State Check
            if (!rimWorldData.gameState ||
                (rimWorldData.gameState as any).program_state !== 'Playing' ||
                !rimWorldData.colonists ||
                rimWorldData.colonists.length === 0
            ) {
                consecutiveBadPolls.current += 1;
                // Only surface a real game-state change once we've loaded data
                // before — otherwise debounce transient blips under load.
                if (!hasLoadedDataOnce.current || consecutiveBadPolls.current >= BAD_POLL_THRESHOLD) {
                    onGameStateChange();
                }
                return;
            }

            consecutiveBadPolls.current = 0;
            hasLoadedDataOnce.current = true;
            setData(rimWorldData);
            setLastUpdated(new Date());
            setError(null);
        } catch (error) {
            console.error('Error fetching RimWorld data:', error);
            setError('Failed to load data from RimWorld API');
        } finally {
            setLoading(false);
        }
    }, [onGameStateChange]);

    // 1. Initial Load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // 2. Auto Refresh Logic (Controlled by Context via Props)
    useEffect(() => {
        if (!isAutoRefreshEnabled) return;
        
        const intervalId = setInterval(loadData, 5000);
        return () => clearInterval(intervalId);
    }, [isAutoRefreshEnabled, loadData]);

    // 3. Manual Refresh Logic (Triggered by Navbar Button)
    useEffect(() => {
        // Signal starts at 0. Only trigger if it increments.
        if (refreshSignal > 0) {
            setLoading(true); // Optional: Force spinner on manual refresh
            loadData();
        }
    }, [refreshSignal, loadData]);

    // Sorting Logic Helper
    const getSortedColonists = useCallback((colonists: Colonist[], sortBy: 'name' | 'mood') => {
        const sorted = [...colonists];
        switch (sortBy) {
            case 'mood':
                return sorted.sort((a, b) => (b.mood || 0) - (a.mood || 0));
            case 'name':
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
    }, []);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh: loadData,
        getSortedColonists
    };
};