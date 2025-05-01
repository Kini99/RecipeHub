import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  duration: number; // in minutes
  onComplete: () => void;
  onDone: () => void;
  stepIndex: number;
}

const Timer: React.FC<TimerProps> = ({ duration, onComplete, onDone, stepIndex }) => {
  // Get persisted data or initialize
  const getPersistedData = () => {
    const persistedData = localStorage.getItem(`timer_${stepIndex}`);
    if (persistedData) {
      const { timeLeft, isActive, startTime } = JSON.parse(persistedData);
      const elapsedSeconds = isActive ? Math.floor((Date.now() - startTime) / 1000) : 0;
      return {
        timeLeft: Math.max(0, timeLeft - elapsedSeconds),
        isActive,
        startTime: isActive ? startTime : Date.now()
      };
    }
    return {
      timeLeft: duration * 60,
      isActive: true,
      startTime: Date.now()
    };
  };

  const [timerData, setTimerData] = useState(getPersistedData());
  const timerRef = useRef<number | null>(null);

  // Persist timer data
  useEffect(() => {
    const dataToPersist = {
      timeLeft: timerData.timeLeft,
      isActive: timerData.isActive,
      startTime: timerData.startTime
    };
    localStorage.setItem(`timer_${stepIndex}`, JSON.stringify(dataToPersist));
  }, [timerData, stepIndex]);

  // Clean up persisted data when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem(`timer_${stepIndex}`);
    };
  }, [stepIndex]);

  useEffect(() => {
    if (!timerData.isActive) return;

    timerRef.current = window.setInterval(() => {
      setTimerData(prev => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 1);

        if (newTimeLeft <= 0) {
          clearInterval(timerRef.current!);
          onComplete();
          return { ...prev, timeLeft: 0, isActive: false };
        }

        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [timerData.isActive, onComplete]);


  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0
    ? ((duration * 60 - timerData.timeLeft) / (duration * 60)) * 100
    : 0;

  const handlePauseResume = () => {
    setTimerData(prev => ({
      ...prev,
      isActive: !prev.isActive,
      startTime: !prev.isActive ? Date.now() : prev.startTime,
    }));
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Time Left: {formatTime(timerData.timeLeft)}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={handlePauseResume}
          className={`px-4 py-2 rounded transition-colors ${timerData.isActive
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-green-500 hover:bg-green-600'
            } text-white`}
        >
          {timerData.isActive ? 'Pause' : 'Resume'}
        </button>

        <button
          onClick={onDone}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Timer; 