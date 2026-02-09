import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Footer = ({ brandName, year, links, socialLinks, className = '' }) => {
  return (
    <footer className={`bg-gray-800 text-white ${className}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold">{brandName}</h3>
            <p className="mt-4 text-gray-300 text-sm">
              © {year} {brandName}. Tous droits réservés.
            </p>
          </div>

          {/* Links */}
          {links.map((section, index) => (
            <div key={index} className="col-span-1">
              <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.to}
                      className="text-base text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Suivez-nous
            </h4>
            <div className="flex space-x-6 mt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{social.name}</span>
                  <i className={`${social.icon} text-xl`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  brandName: PropTypes.string.isRequired,
  year: PropTypes.number,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          to: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};

Footer.defaultProps = {
  year: new Date().getFullYear(),
  links: [],
  socialLinks: [],
};

export default Footer;
