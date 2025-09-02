import React, { useState } from 'react';
import Card from '../common/Card';

const CalendarView = ({ bookings = [] }) => {
  const [viewType, setViewType] = useState('weekly');
  
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = Array.from({length: 30}, (_, i) => i + 1);

  return (
    <Card title="Calendar View">
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => setViewType('weekly')}
          className={`px-4 py-2 rounded ${viewType === 'weekly' ? 'bg-ayur-primary text-white' : 'bg-gray-200'}`}
        >
          Weekly
        </button>
        <button 
          onClick={() => setViewType('monthly')}
          className={`px-4 py-2 rounded ${viewType === 'monthly' ? 'bg-ayur-primary text-white' : 'bg-gray-200'}`}
        >
          Monthly
        </button>
      </div>
      
      {viewType === 'weekly' ? (
        <div className="grid grid-cols-7 gap-1 text-sm">
          <div className="p-2 font-medium">Time</div>
          {weekDays.map(day => (
            <div key={day} className="p-2 font-medium text-center bg-ayur-light">{day}</div>
          ))}
          
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="p-2 text-gray-600">{time}</div>
              {weekDays.map((day, dayIndex) => {
                const today = new Date();
                const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));
                const dayDate = new Date(currentWeekStart);
                dayDate.setDate(currentWeekStart.getDate() + dayIndex);
                
                const dayBookings = bookings.filter(booking => {
                  const bookingDate = new Date(booking.date);
                  return bookingDate.toDateString() === dayDate.toDateString() && booking.time === time;
                });
                
                return (
                  <div key={`${day}-${time}`} className="p-2 border border-gray-200 h-16 hover:bg-ayur-light cursor-pointer">
                    {dayBookings.map(booking => (
                      <div key={booking._id} className={`text-white text-xs p-1 rounded mb-1 ${
                        booking.status === 'confirmed' ? 'bg-green-500' :
                        booking.status === 'pending' ? 'bg-yellow-500' :
                        booking.status === 'completed' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}>
                        {(booking.therapy || booking.therapyType || 'Session').substring(0, 8)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 font-medium text-center bg-ayur-light text-sm">{day}</div>
          ))}
          {monthDays.map(day => {
            const today = new Date();
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const dayDate = new Date(monthStart);
            dayDate.setDate(day);
            
            const dayBookings = bookings.filter(booking => {
              const bookingDate = new Date(booking.date);
              return bookingDate.toDateString() === dayDate.toDateString();
            });
            
            return (
              <div key={day} className="p-3 border border-gray-200 h-20 hover:bg-ayur-light cursor-pointer relative">
                <span className="text-sm font-medium">{day}</span>
                {dayBookings.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="bg-ayur-secondary text-white text-xs p-1 rounded text-center">
                      {dayBookings.length} session{dayBookings.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default CalendarView;