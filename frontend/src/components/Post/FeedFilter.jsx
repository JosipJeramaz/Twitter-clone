import React from 'react';
import './FeedFilter.css';

const FeedFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="feed-filter">
      <button 
        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All Posts
      </button>
      <button 
        className={`filter-btn ${activeFilter === 'following' ? 'active' : ''}`}
        onClick={() => onFilterChange('following')}
      >
        Following
      </button>
    </div>
  );
};

export default FeedFilter;
