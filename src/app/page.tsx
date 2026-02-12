'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// --- Types ---
type ItineraryItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  locationQuery: string; // For Google Maps
};

type DaySchedule = {
  day: string;
  date: string;
  items: ItineraryItem[];
};

// --- Data: The Warsaw Car Itinerary ---
const itineraryData: DaySchedule[] = [
  {
    day: 'Friday',
    date: 'Arrival & Old Town',
    items: [
      {
        id: 'fri-land',
        time: '15:20',
        title: 'Land at Chopin Airport',
        description: 'Pick up rental car. Prepare for rush hour traffic.',
        locationQuery: 'Warsaw Chopin Airport Arrivals',
      },
      {
        id: 'fri-checkin',
        time: '16:30',
        title: 'Hotel Check-in',
        description: 'Drop off bags. Park the car (street parking is paid until 20:00).',
        locationQuery: 'Warsaw City Center',
      },
      {
        id: 'fri-walk',
        time: '17:30',
        title: 'Old Town Walk',
        description: 'Park near Old Town. Walk Castle Square, Market Square & Barbican.',
        locationQuery: 'Plac Zamkowy, Warszawa',
      },
      {
        id: 'fri-dinner',
        time: '19:30',
        title: 'Dinner: Stary Dom or U Fukiera',
        description: 'Traditional Polish cuisine. Remember: 0.0 alcohol tolerance for drivers.',
        locationQuery: 'Restauracja Stary Dom, Warszawa',
      },
    ],
  },
  {
    day: 'Saturday',
    date: 'Palaces & History',
    items: [
      {
        id: 'sat-wilanow',
        time: '09:30',
        title: 'Wilanów Palace',
        description: 'The "Polish Versailles". Easy driving & parking south of city.',
        locationQuery: 'Museum of King Jan III\'s Palace at Wilanów',
      },
      {
        id: 'sat-lunch',
        time: '12:30',
        title: 'Lunch at Hala Koszyki',
        description: 'Trendy food hall in a restored industrial building.',
        locationQuery: 'Hala Koszyki, Warszawa',
      },
      {
        id: 'sat-museum',
        time: '14:30',
        title: 'Warsaw Uprising Museum',
        description: 'Immersive history of 1944. A must-see.',
        locationQuery: 'Warsaw Uprising Museum',
      },
      {
        id: 'sat-view',
        time: '17:00',
        title: 'Palace of Culture & Science',
        description: 'Iconic Stalinist tower. View from the 30th floor.',
        locationQuery: 'Palace of Culture and Science, Warsaw',
      },
      {
        id: 'sat-dinner',
        time: '20:00',
        title: 'Dinner in Praga District',
        description: 'Try "Pyzy Flaki Gorące" for jarred street food.',
        locationQuery: 'Ząbkowska, Warszawa',
      },
    ],
  },
  {
    day: 'Sunday',
    date: 'Royalty & Departure',
    items: [
      {
        id: 'sun-park',
        time: '09:30',
        title: 'Łazienki Królewskie Park',
        description: 'Peaceful Sunday walk. See the Palace on the Isle.',
        locationQuery: 'Łazienki Królewskie, Warszawa',
      },
      {
        id: 'sun-lunch',
        time: '12:00',
        title: 'Farewell Lunch: Różana',
        description: 'Elegant Polish dining with a garden. Near the park.',
        locationQuery: 'Restauracja Różana, Warszawa',
      },
      {
        id: 'sun-airport',
        time: '14:00',
        title: 'Drive to Airport',
        description: 'Refuel car and return rental. Flight check-in.',
        locationQuery: 'Warsaw Chopin Airport Departures',
      },
    ],
  },
];

// --- Components ---

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function WarsawItinerary() {
  // State for checkboxes
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('warsawTripProgress');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse itinerary state");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warsawTripProgress', JSON.stringify(checkedItems));
    }
  }, [checkedItems, isLoaded]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getMapsLink = (query: string) => {
    // Opens Google Maps in Driving mode
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`;
  };

  if (!isLoaded) return <div className="p-10 text-center">Loading itinerary...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <Head>
        <title>Warsaw 48h Trip</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Warsaw Weekend</h1>
          <p className="text-gray-600 mt-2">Friday 15:20 — Sunday 16:00</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            <span className="mr-2">🚗</span> Car Rental Mode
          </div>
        </header>

        <div className="space-y-12">
          {itineraryData.map((day) => (
            <div key={day.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Day Header */}
              <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{day.day}</h2>
                <span className="text-slate-300 text-sm">{day.date}</span>
              </div>

              {/* Timeline Items */}
              <div className="p-6">
                {day.items.map((item, index) => {
                  const isChecked = checkedItems[item.id] || false;
                  const isLast = index === day.items.length - 1;

                  return (
                    <div key={item.id} className="relative flex gap-4">
                      {/* Timeline Line */}
                      {!isLast && (
                        <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-gray-200" />
                      )}

                      {/* Checkbox / Bullet */}
                      <div className="relative z-10 flex-shrink-0 pt-1">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                            isChecked
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-300 text-transparent hover:border-green-400'
                          }`}
                        >
                          <CheckIcon />
                        </button>
                      </div>

                      {/* Content */}
                      <div className={`flex-grow pb-8 ${isChecked ? 'opacity-50 grayscale transition-all' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 mb-1">
                              {item.time}
                            </span>
                            <h3 className={`text-lg font-semibold ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Map Button */}
                          <a
                            href={getMapsLink(item.locationQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 mt-2 sm:mt-0 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors border border-blue-200 min-w-[120px]"
                          >
                            <MapIcon />
                            Navigate
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
          <p>Progress saved automatically.</p>
        </footer>
      </div>
    </div>
  );
}
