import React from 'react';

const usePointerPosition = () => {
  const [position, setPosition] = React.useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  React.useEffect(() => {
    //   const updateMousePosition = (ev: MouseEvent): void => {
    //     setMousePosition({ x: ev.clientX, y: ev.clientY });
    //   };

    //   window.addEventListener('mousemove', updateMousePosition);

    //   return () => {
    //     window.removeEventListener('mousemove', updateMousePosition);
    //   };
    // }, []);

    const updatePosition = (ev: MouseEvent | TouchEvent): void => {
      if (ev instanceof MouseEvent) {
        setPosition({ x: ev.clientX, y: ev.clientY });
      } else if (ev instanceof TouchEvent) {
        const touch = ev.touches[0];
        if (touch) {
          setPosition({ x: touch.clientX, y: touch.clientY });
        }
      }
    };

    // Mouse events
    window.addEventListener('mousemove', updatePosition);

    // Touch events
    window.addEventListener('touchmove', updatePosition);
    window.addEventListener('touchstart', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('touchmove', updatePosition);
      window.removeEventListener('touchstart', updatePosition);
    };
  }, []);

  return position;
};

export default usePointerPosition;
