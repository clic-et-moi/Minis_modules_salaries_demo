import React from 'react';
import PropTypes from 'prop-types';

const Section = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <section className={`py-12 md:py-20 ${className}`} {...props}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70 sm:mt-4">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Section;
