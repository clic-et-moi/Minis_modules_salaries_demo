import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ 
  level = 'h1', 
  children, 
  className = '', 
  withUnderline = false,
  ...props 
}) => {
  const baseStyles = 'font-bold text-gray-900 dark:text-white';
  const underlineStyles = 'relative pb-2 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-blue-600';
  
  const variants = {
    h1: 'text-4xl sm:text-5xl lg:text-6xl',
    h2: 'text-3xl sm:text-4xl',
    h3: 'text-2xl sm:text-3xl',
    h4: 'text-xl sm:text-2xl',
    h5: 'text-lg sm:text-xl',
    h6: 'text-base sm:text-lg',
  };

  const Tag = level;
  
  return (
    <Tag 
      className={`${baseStyles} ${variants[level]} ${withUnderline ? underlineStyles : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  level: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  withUnderline: PropTypes.bool,
};

export default Heading;
