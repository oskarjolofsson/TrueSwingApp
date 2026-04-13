import { useState } from 'react';

// Vi lägger till <T extends string> för att göra den generisk
export function useScreenSequence<T extends string>({ screens }: { screens: T[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goTo = (name: T) => { // Nu tillåts bara giltiga skärmnamn här
    const index = screens.indexOf(name);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  return {
    // Nu vet TS att currentScreen är av typen T (t.ex. 'SelectVideo' | 'TrimVideo'...)
    currentScreen: screens[currentIndex] as T,
    currentIndex,
    next,
    prev,
    goTo,
    isFirst: currentIndex === 0,
    isLast: currentIndex === screens.length - 1
  };
}
