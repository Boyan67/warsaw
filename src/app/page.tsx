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
        title: 'Land at Modlin Airport',
        description: 'Pick up rental car. Expect ~45-60 min drive to city center.',
        locationQuery: 'Warsaw Modlin Airport',
      },
      {
        id: 'fri-checkin',
        time: '16:30',
        title: 'Hotel Check-in',
        description: 'Drop off bags. Park the car (street parking is paid until 20:00).',
        locationQuery: '5 Kokoryczki 124, piętro 8, Praga Poludnie, 04-191 Warsaw, Poland',
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
        title: 'Drive to Modlin Airport',
        description: 'Allow 1 hour for the drive. Refuel car and return rental.',
        locationQuery: 'Warsaw Modlin Airport',
      },
    ],
  },
];

const extraIdeas = [
  { title: 'POLIN Museum', query: 'POLIN Museum of the History of Polish Jews' },
  { title: 'Copernicus Science Centre', query: 'Copernicus Science Centre Warsaw' },
  { title: 'Neon Museum', query: 'Neon Museum Warsaw' },
  { title: 'Vistula River Boulevards', query: 'Bulwary Wiślane Warsaw' },
  { title: 'Fabryka Norblina', query: 'Fabryka Norblina Warsaw' },
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
  const [itinerary, setItinerary] = useState<DaySchedule[]>(itineraryData);
  const [tripTitle, setTripTitle] = useState('Warsaw Weekend');
  const [tripSubtitle, setTripSubtitle] = useState('Friday 15:20 — Sunday 16:00');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('warsawTripProgress');
    if (savedProgress) {
      try {
        setCheckedItems(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to parse itinerary progress");
      }
    }

    const savedItinerary = localStorage.getItem('warsawTripItinerary');
    if (savedItinerary) {
      try {
        setItinerary(JSON.parse(savedItinerary));
      } catch (e) {
        console.error("Failed to parse itinerary data");
      }
    }

    const savedTitle = localStorage.getItem('warsawTripTitle');
    if (savedTitle) setTripTitle(savedTitle);

    const savedSubtitle = localStorage.getItem('warsawTripSubtitle');
    if (savedSubtitle) setTripSubtitle(savedSubtitle);

    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warsawTripProgress', JSON.stringify(checkedItems));
    }
  }, [checkedItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warsawTripItinerary', JSON.stringify(itinerary));
    }
  }, [itinerary, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warsawTripTitle', tripTitle);
    }
  }, [tripTitle, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warsawTripSubtitle', tripSubtitle);
    }
  }, [tripSubtitle, isLoaded]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const updateItem = (dayIndex: number, itemIndex: number, field: keyof ItineraryItem, value: string) => {
    setItinerary(prev => {
      const newItinerary = [...prev];
      const newDay = { ...newItinerary[dayIndex] };
      const newItems = [...newDay.items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      newDay.items = newItems;
      newItinerary[dayIndex] = newDay;
      return newItinerary;
    });
  };

  const updateDayHeader = (dayIndex: number, field: 'day' | 'date', value: string) => {
    setItinerary(prev => {
      const newItinerary = [...prev];
      newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: value };
      return newItinerary;
    });
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      setItinerary(itineraryData);
      setTripTitle('Warsaw Weekend');
      setTripSubtitle('Friday 15:20 — Sunday 16:00');
      setCheckedItems({});
      localStorage.removeItem('warsawTripItinerary');
      localStorage.removeItem('warsawTripTitle');
      localStorage.removeItem('warsawTripSubtitle');
      localStorage.removeItem('warsawTripProgress');
    }
  };

  const addItem = (dayIndex: number) => {
    setItinerary(prev => {
      const newItinerary = [...prev];
      const newDay = { ...newItinerary[dayIndex] };
      const newId = `custom-${Date.now()}`;
      newDay.items = [
        ...newDay.items,
        {
          id: newId,
          time: '12:00',
          title: 'New Event',
          description: 'Description of the event',
          locationQuery: 'Warsaw',
        }
      ];
      newItinerary[dayIndex] = newDay;
      return newItinerary;
    });
  };

  const removeItem = (dayIndex: number, itemIndex: number) => {
    if (confirm('Remove this item?')) {
      setItinerary(prev => {
        const newItinerary = [...prev];
        const newDay = { ...newItinerary[dayIndex] };
        newDay.items = newDay.items.filter((_, i) => i !== itemIndex);
        newItinerary[dayIndex] = newDay;
        return newItinerary;
      });
    }
  };

  const getMapsLink = (query: string) => {
    // Opens Google Maps in Driving mode
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`;
  };

  if (!isLoaded) return <div className="p-10 text-center">Loading itinerary...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <Head>
        <title>{tripTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <input
            type="text"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
            className="block w-full text-3xl font-bold text-gray-900 text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0"
          />
          <input
            type="text"
            value={tripSubtitle}
            onChange={(e) => setTripSubtitle(e.target.value)}
            className="block w-full text-gray-600 mt-2 text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0"
          />
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              <span className="mr-2">🚗</span> Car Rental Mode
            </div>
            <button
              onClick={resetData}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Reset to Defaults
            </button>
          </div>
        </header>

        <div className="space-y-12">
          {itinerary.map((day, dayIndex) => (
            <div key={day.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Day Header */}
              <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
                <input
                  type="text"
                  value={day.day}
                  onChange={(e) => updateDayHeader(dayIndex, 'day', e.target.value)}
                  className="bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0 text-xl font-bold w-1/2"
                />
                <input
                  type="text"
                  value={day.date}
                  onChange={(e) => updateDayHeader(dayIndex, 'date', e.target.value)}
                  className="bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0 text-slate-300 text-sm text-right w-1/2"
                />
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
                          <div className="flex-grow">
                            <input
                              type="text"
                              value={item.time}
                              onChange={(e) => updateItem(dayIndex, index, 'time', e.target.value)}
                              className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 mb-1 border-none focus:ring-1 focus:ring-blue-500 w-16"
                            />
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItem(dayIndex, index, 'title', e.target.value)}
                              className={`block w-full text-lg font-semibold bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0 mb-1 ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}
                            />
                            <textarea
                              value={item.description}
                              onChange={(e) => updateItem(dayIndex, index, 'description', e.target.value)}
                              className="w-full text-gray-600 text-sm mt-1 leading-relaxed bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0 resize-none overflow-hidden"
                              rows={2}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                              }}
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-gray-400 font-mono">Location:</span>
                              <input
                                type="text"
                                value={item.locationQuery}
                                onChange={(e) => updateItem(dayIndex, index, 'locationQuery', e.target.value)}
                                className="text-xs text-blue-600 bg-transparent border-none focus:ring-1 focus:ring-blue-500 p-0 flex-grow"
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 mt-2 sm:mt-0">
                            <a
                              href={getMapsLink(item.locationQuery)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors border border-blue-200 min-w-[120px]"
                            >
                              <MapIcon />
                              Navigate
                            </a>
                            <button
                              onClick={() => removeItem(dayIndex, index)}
                              className="text-xs text-red-400 hover:text-red-600 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => addItem(dayIndex)}
                  className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  <span className="text-lg">+</span> Add Item
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Ideas Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Extra Ideas & Alternatives</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extraIdeas.map((idea) => (
                <a
                  key={idea.title}
                  href={`https://www.google.com/search?q=${encodeURIComponent(idea.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <span className="text-gray-700 font-medium">{idea.title}</span>
                  <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
          <p>Progress saved automatically.</p>
        </footer>
      </div>
    </div>
  );
}
