import { selectIsAuthenticated } from '@/redux/slice/slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function useSelectorWithDelay() {
  const [isAuthed, setAuthed] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const selectedState = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {

      setTimerExpired(true);
    
    }, 3000);

    if (selectedState) {
        setAuthed(selectedState);
      clearTimeout(timer); 
    }

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, 2500]);

  return { isAuthed, timerExpired };
}

export default useSelectorWithDelay;