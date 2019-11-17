import React from 'react';
import PropTypes from 'prop-types';


// firendList image
function Image({ className, src }) {
    return (
      <img
        src={src} 
        className={className}
        alt="" 
      />
    );
  }
  
  Image.propTypes = {
    className: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  };

  export default Image;
