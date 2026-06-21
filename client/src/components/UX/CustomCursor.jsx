import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const CustomCursor = () => {
  const { cursorEnabled } = useTheme();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPosition, setDotPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!cursorEnabled) return;

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Delay effect for the trailing outer circle
      requestAnimationFrame(() => {
        setDotPosition({ x: e.clientX, y: e.clientY });
      });

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('select')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorEnabled, isVisible]);

  if (!cursorEnabled || !isVisible) return null;

  return (
    <>
      <div
        className={`custom-cursor hidden lg:block ${isHovered ? 'hovered' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="custom-cursor-dot hidden lg:block"
        style={{ left: `${dotPosition.x}px`, top: `${dotPosition.y}px` }}
      />
    </>
  );
};

export default CustomCursor;
