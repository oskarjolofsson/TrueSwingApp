import { useCallback, useState } from 'react';

export function useScreenSequence<T extends string>({ screens }: { screens: T[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  },  [screens]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [screens]);

  const goTo = useCallback((name: T) => { 
    const index = screens.indexOf(name);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [screens]);

  return {
    currentScreen: screens[currentIndex] as T,
    currentIndex,
    next,
    prev,
    goTo,
    isFirst: currentIndex === 0,
    isLast: currentIndex === screens.length - 1
  };
}
