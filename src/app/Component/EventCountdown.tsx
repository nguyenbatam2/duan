// components/EventCountdown.js
import React, { useEffect, useState } from 'react';

const EventCountdown = ({ event }) => {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const endTime = new Date(event.end_time);
            const timeRemaining = endTime - now;

            if (timeRemaining > 0) {
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [event.end_time]);

    return (
        <div className="count-down">
            <div className="timer-view">
                <div className="block-timer"><p><b>{countdown.days}</b></p><span>Ngày</span></div>
                <div className="block-timer"><p><b>{countdown.hours}</b></p><span>Giờ</span></div>
                <div className="block-timer"><p><b>{countdown.minutes}</b></p><span>Phút</span></div>
                <div className="block-timer"><p><b>{countdown.seconds}</b></p><span>Giây</span></div>
            </div>
        </div>
    );
};

export default EventCountdown;
