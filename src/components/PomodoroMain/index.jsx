import { useContext, useEffect, useState } from 'react';
import ThemeContext from '../../context/ThemeSwitchContext/ThemeContext';
import styles from './PomodoroMain.module.css';

import { darkInToLight } from '../../utils/themeSwitcher';

import PomodoroTimerButton from '../PomodoroTimerButton';
import PomodoroButton from '../PomodoroButton';

import {
  defaultBreakTime,
  defaultPomodoroTime,
} from '../../CONSTANTS/pomodoroDefaultTimes';

export default function PomodoroMain({ setCounts }) {
  const { theme } = useContext(ThemeContext);
  const [time, setTime] = useState(defaultPomodoroTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false); //state for check and set timer running
  const [isPomodoroTimer, setIsPomodoroTimer] = useState(true); //state for check and set if timer is pomodoro timer or break timer

  useEffect(() => {
    let interval;
    if (isTimerRunning && time > 0) {
      interval = setInterval(() => {
        if (time === 0) {
          setIsTimerRunning(false);
        }
        setTime((prevState) => prevState - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, time]);

  const handleChangeTimer = (e) => {
    console.log(time);
    if (time >= 60 && e.target.innerText === '-')
      return setTime((prevState) => prevState - 60);
    if (time > 3500 && time < 3600) return setTime(3600);
    if (time <= 3600 && e.target.innerText === '+')
      return setTime((prevState) => prevState + 60);
  };

  const formatTimeSeconds = (timeSeconds) => {
    const minutes = Math.floor(timeSeconds / 60);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = (timeSeconds % 60).toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const startAndPauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTime(isPomodoroTimer ? defaultPomodoroTime : defaultBreakTime);
  };

  const doneTimer = () => {
    setIsTimerRunning(false);
    setTime(!isPomodoroTimer ? defaultPomodoroTime : defaultBreakTime);
    setIsPomodoroTimer(!isPomodoroTimer);
    if (isPomodoroTimer) setCounts((prevState) => prevState + 1);
  };

  return (
    <>
      <div className={styles.pomodoroTimerContainer}>
        <PomodoroTimerButton
          isTimerRunning={isTimerRunning}
          handleChangeTimer={handleChangeTimer}
        >
          -
        </PomodoroTimerButton>

        <span
          className={`${styles.pomodoroTimer} ${
            isPomodoroTimer
              ? styles.pomodoroTimerRed
              : styles.pomodoroTimerGreen
          }`}
        >
          {formatTimeSeconds(time)}
        </span>

        <PomodoroTimerButton
          isTimerRunning={isTimerRunning}
          handleChangeTimer={handleChangeTimer}
        >
          +
        </PomodoroTimerButton>
      </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.startAndStopButtonContainer}>
          <PomodoroButton
            handlePomodoroAction={startAndPauseTimer}
            className={`${darkInToLight(theme)}`}
            type="button"
          >
            {isTimerRunning ? 'Pause' : 'Start'}
          </PomodoroButton>
          {!isTimerRunning ? null : (
            <PomodoroButton
              handlePomodoroAction={stopTimer}
              className={`${styles.pomodoroButtonStop}`}
              type="button"
            >
              Stop
            </PomodoroButton>
          )}
        </div>

        {!isTimerRunning ? null : (
          <PomodoroButton
            handlePomodoroAction={doneTimer}
            className={`${styles.pomodoroButtonDone}`}
            type="button"
          >
            Done
          </PomodoroButton>
        )}
      </div>
    </>
  );
}
