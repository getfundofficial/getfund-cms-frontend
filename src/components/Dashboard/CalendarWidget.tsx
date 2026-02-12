import React, { useState, useEffect } from 'react';
import { eventService, CompanyEvent, Holiday } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { isAdminRole } from '../../types/auth.types';
import { EventModal } from './EventModal';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CompanyEvent[];
  holidays: Holiday[];
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  meeting: 'bg-blue-500',
  deadline: 'bg-red-500',
  celebration: 'bg-green-500',
  training: 'bg-purple-500',
  other: 'bg-primary-500',
};

export const CalendarWidget: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CompanyEvent | null>(null);
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);
  const [selectedDayDetails, setSelectedDayDetails] = useState<CalendarDay | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadData();
  }, [year, month]);

  const loadData = async () => {
    setLoading(true);

    // Load events and holidays in parallel, handling errors independently
    const [eventsResult, holidaysResult] = await Promise.allSettled([
      eventService.getEventsByMonth(year, month + 1),
      eventService.getHolidays(year),
    ]);

    if (eventsResult.status === 'fulfilled') {
      setEvents(eventsResult.value || []);
    } else {
      console.error('Error loading events:', eventsResult.reason);
      setEvents([]);
    }

    if (holidaysResult.status === 'fulfilled') {
      const holidaysData = holidaysResult.value || [];
      console.log('[Calendar] Loaded holidays:', holidaysData);
      setHolidays(holidaysData);
    } else {
      console.error('Error loading holidays:', holidaysResult.reason);
      setHolidays([]);
    }

    setLoading(false);
  };

  const getDaysInMonth = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    // Get the day of week for the first day (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();

    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        events: getEventsForDate(date),
        holidays: getHolidaysForDate(date),
      });
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        events: getEventsForDate(date),
        holidays: getHolidaysForDate(date),
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        events: getEventsForDate(date),
        holidays: getHolidaysForDate(date),
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatDateString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getEventsForDate = (date: Date): CompanyEvent[] => {
    const dateStr = formatDateString(date);
    return events.filter((e) => e.event_date.split('T')[0] === dateStr);
  };

  const getHolidaysForDate = (date: Date): Holiday[] => {
    const dateStr = formatDateString(date);
    return holidays.filter((h) => h.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    // If day has holidays or events, show details modal
    if (day.holidays.length > 0 || day.events.length > 0) {
      setSelectedDayDetails(day);
    } else if (isAdmin && day.isCurrentMonth) {
      // For admin on empty days, open event creation modal
      setEditingEvent(null);
      setShowEventModal(true);
    }
  };

  const handleEventClick = (e: React.MouseEvent, event: CompanyEvent) => {
    e.stopPropagation();
    if (isAdmin) {
      setEditingEvent(event);
      setShowEventModal(true);
    }
  };

  const handleEventSaved = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    loadData();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-xl shadow-md p-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Calendar</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-2 py-0.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Next month"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Month/Year */}
      <div className="text-center mb-2">
        <h4 className="text-sm font-bold text-gray-900">
          {monthNames[month]} {year}
        </h4>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Day names */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-[10px] font-medium text-gray-500 py-1">
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 relative">
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => (day.holidays.length > 0 || day.events.length > 0) && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`
                  h-8 p-0.5 border rounded cursor-pointer transition-all text-center relative
                  ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                  ${day.isToday ? 'ring-1 ring-primary-500 border-primary-500' : 'border-gray-200'}
                  ${isAdmin && day.isCurrentMonth ? 'hover:border-primary-300' : ''}
                `}
              >
                <div className={`text-xs font-medium ${day.isToday ? 'text-primary-600' : ''}`}>
                  {day.date.getDate()}
                </div>

                {/* Event/Holiday dots */}
                {(day.holidays.length > 0 || day.events.length > 0) && (
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {day.holidays.length > 0 && (
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    )}
                    {day.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => handleEventClick(e, event)}
                        className={`w-1.5 h-1.5 rounded-full ${EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.other}`}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Tooltip on hover */}
                {hoveredDay === day && (day.holidays.length > 0 || day.events.length > 0) && (
                  <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 w-40 bg-gray-900 text-white text-[10px] rounded-lg p-2 shadow-lg pointer-events-none">
                    {day.holidays.map((holiday, i) => (
                      <div key={`h-${i}`} className="flex items-center gap-1 mb-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="truncate">{holiday.name}</span>
                      </div>
                    ))}
                    {day.events.map((event) => (
                      <div key={event.id} className="flex items-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.other}`}></div>
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-500">Holiday</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-500">Event</span>
              </div>
            </div>
          </div>

          {/* Admin hint */}
          {isAdmin && (
            <div className="mt-1 text-[10px] text-gray-400 text-center">
              Click date to add event
            </div>
          )}
        </>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={handleEventSaved}
          event={editingEvent}
          defaultDate={selectedDate ? formatDateString(selectedDate) : undefined}
        />
      )}

      {/* Day Details Modal */}
      {selectedDayDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDayDetails(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDayDetails.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Holidays */}
            {selectedDayDetails.holidays.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Public Holiday{selectedDayDetails.holidays.length > 1 ? 's' : ''}
                </h4>
                {selectedDayDetails.holidays.map((holiday, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                    <p className="font-semibold text-gray-900">{holiday.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      This is a public holiday in Ghana. Government offices and most businesses are closed.
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Events */}
            {selectedDayDetails.events.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-primary-600 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  Event{selectedDayDetails.events.length > 1 ? 's' : ''}
                </h4>
                {selectedDayDetails.events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-2 cursor-pointer hover:bg-primary-100 transition-colors"
                    onClick={() => {
                      if (isAdmin) {
                        setSelectedDayDetails(null);
                        setEditingEvent(event);
                        setShowEventModal(true);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.other}`}></div>
                      <p className="font-semibold text-gray-900">{event.title}</p>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 capitalize">{event.event_type}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Event Button for Admin */}
            {isAdmin && selectedDayDetails.isCurrentMonth && (
              <button
                onClick={() => {
                  setSelectedDayDetails(null);
                  setEditingEvent(null);
                  setShowEventModal(true);
                }}
                className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                + Add Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
