import * as Location from 'expo-location';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather interpretation codes mapping
// See: https://open-meteo.com/en/docs
const WMO_CODES = {
    0: { condition: 'Clear sky', icon: '☀️', category: 'sunny' },
    1: { condition: 'Mainly clear', icon: '🌤️', category: 'sunny' },
    2: { condition: 'Partly cloudy', icon: '⛅', category: 'cloudy' },
    3: { condition: 'Overcast', icon: '☁️', category: 'cloudy' },
    45: { condition: 'Fog', icon: '🌫️', category: 'cloudy' },
    48: { condition: 'Depositing rime fog', icon: '🌫️', category: 'cloudy' },
    51: { condition: 'Light drizzle', icon: '🌦️', category: 'rainy' },
    53: { condition: 'Moderate drizzle', icon: '🌦️', category: 'rainy' },
    55: { condition: 'Dense drizzle', icon: '🌧️', category: 'rainy' },
    56: { condition: 'Light freezing drizzle', icon: '🌨️', category: 'rainy' },
    57: { condition: 'Dense freezing drizzle', icon: '🌨️', category: 'rainy' },
    61: { condition: 'Slight rain', icon: '🌧️', category: 'rainy' },
    63: { condition: 'Moderate rain', icon: '🌧️', category: 'rainy' },
    65: { condition: 'Heavy rain', icon: '🌧️', category: 'rainy' },
    66: { condition: 'Light freezing rain', icon: '🌨️', category: 'snowy' },
    67: { condition: 'Heavy freezing rain', icon: '🌨️', category: 'snowy' },
    71: { condition: 'Slight snow', icon: '❄️', category: 'snowy' },
    73: { condition: 'Moderate snow', icon: '❄️', category: 'snowy' },
    75: { condition: 'Heavy snow', icon: '❄️', category: 'snowy' },
    77: { condition: 'Snow grains', icon: '❄️', category: 'snowy' },
    80: { condition: 'Slight rain showers', icon: '🌦️', category: 'rainy' },
    81: { condition: 'Moderate rain showers', icon: '🌧️', category: 'rainy' },
    82: { condition: 'Violent rain showers', icon: '🌧️', category: 'rainy' },
    85: { condition: 'Slight snow showers', icon: '🌨️', category: 'snowy' },
    86: { condition: 'Heavy snow showers', icon: '🌨️', category: 'snowy' },
    95: { condition: 'Thunderstorm', icon: '⛈️', category: 'rainy' },
    96: { condition: 'Thunderstorm with slight hail', icon: '⛈️', category: 'rainy' },
    99: { condition: 'Thunderstorm with heavy hail', icon: '⛈️', category: 'rainy' },
};

// Default fallback for unknown codes
const DEFAULT_WEATHER = { condition: 'Unknown', icon: '🌡️', category: 'cloudy' };

/**
 * Get weather message based on weather category and temperature
 */
const getWeatherMessage = (category, tempCelsius) => {
    // Temperature-based messages (takes priority for extreme temps)
    if (tempCelsius <= 5) {
        return 'Warm Up With These';
    }
    if (tempCelsius >= 30) {
        return 'Cool & Refreshing';
    }

    // Weather category-based messages
    switch (category) {
        case 'rainy':
            return 'Rainy Day Comforts';
        case 'snowy':
            return 'Warm Up With These';
        case 'sunny':
            return tempCelsius >= 25 ? 'Cool & Refreshing' : 'Perfect Day Treats';
        case 'cloudy':
        default:
            return 'Cozy Weather Picks';
    }
};

/**
 * Request location permissions from the user
 */
export const requestLocationPermission = async () => {
    console.log('Requesting location permission...');
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Location permission status:', status);
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
    }
};

/**
 * Get the user's current location with timeout
 * Falls back to default location (Dubai) if location fails
 */
export const getCurrentLocation = async () => {
    // Default location (Dubai) as fallback
    const DEFAULT_LOCATION = {
        latitude: 25.2048,
        longitude: 55.2708,
    };

    try {
        const hasPermission = await requestLocationPermission();

        if (!hasPermission) {
            console.log('Location permission denied, using default location');
            return DEFAULT_LOCATION;
        }

        // Create a promise that rejects after timeout
        const timeout = (ms) => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Location request timed out')), ms)
        );

        try {
            // Try to get last known location first (faster)
            const lastKnown = await Location.getLastKnownPositionAsync();
            if (lastKnown) {
                console.log('Using last known location');
                return {
                    latitude: lastKnown.coords.latitude,
                    longitude: lastKnown.coords.longitude,
                };
            }
        } catch (e) {
            console.log('No last known location available');
        }

        // Race between getting current position and timeout
        const location = await Promise.race([
            Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
            }),
            timeout(5000), // 5 second timeout
        ]);

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.log('Location error, using default:', error.message);
        return DEFAULT_LOCATION;
    }
};

/**
 * Fetch current weather data from Open-Meteo API
 */
export const fetchWeather = async (latitude, longitude) => {
    const url = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.reason || 'Weather API error');
    }

    return data;
};

/**
 * Get formatted weather data for the UI
 * This is the main function to use in components
 */
export const getWeatherData = async () => {
    // Fallback data
    const fallbackData = {
        success: false,
        condition: 'Weather unavailable',
        icon: '🌡️',
        temp: '--°C',
        temperature: null,
        message: 'Food For Any Weather',
        category: 'unknown',
        error: 'Could not get weather',
    };

    // Create timeout promise
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            console.log('Weather fetch timed out, using fallback');
            resolve(fallbackData);
        }, 15000); // 15 second total timeout
    });

    // Create weather fetch promise
    const weatherPromise = (async () => {
        try {
            console.log('Starting weather fetch...');

            // Get user's location
            console.log('Getting location...');
            const { latitude, longitude } = await getCurrentLocation();
            console.log('Location obtained:', latitude, longitude);

            // Fetch weather from API
            console.log('Fetching weather from API...');
            const data = await fetchWeather(latitude, longitude);
            console.log('Weather data received:', data);

            // Extract current weather info
            const weatherCode = data.current.weather_code;
            const temperature = Math.round(data.current.temperature_2m);

            // Get weather details from WMO code mapping
            const weatherInfo = WMO_CODES[weatherCode] || DEFAULT_WEATHER;

            // Generate weather message
            const message = getWeatherMessage(weatherInfo.category, temperature);

            return {
                success: true,
                condition: weatherInfo.condition,
                icon: weatherInfo.icon,
                temp: `${temperature}°C`,
                temperature, // raw number for logic
                message,
                category: weatherInfo.category,
            };
        } catch (error) {
            console.error('Error fetching weather:', error.message);
            return { ...fallbackData, error: error.message };
        }
    })();

    // Race between weather fetch and timeout
    return Promise.race([weatherPromise, timeoutPromise]);
};
