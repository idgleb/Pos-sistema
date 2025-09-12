import React from 'react';
import './PageContainer.css';

const PageContainer = ({ children, className = '', maxWidth = '1200px' }) => {
  return (
    <div className={`page-container ${className}`} style={{ '--max-width': maxWidth }}>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;


