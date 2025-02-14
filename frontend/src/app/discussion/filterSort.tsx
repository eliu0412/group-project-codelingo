import React, { useState } from 'react';

interface Filter {
  sort: 'latest' | 'popular';
  tag: string;
}

interface FilterSortProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ filter, onFilterChange }) => {
  const [sort, setSort] = useState<Filter['sort']>(filter.sort);
  const [tag, setTag] = useState<Filter['tag']>(filter.tag);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as Filter['sort']);
    onFilterChange({ sort: e.target.value as Filter['sort'], tag });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
    onFilterChange({ sort, tag: e.target.value });
  };

  return (
    <div className="filter-sort flex space-x-4 justify-center items-center mt-4 p-4 bg-opacity-70 bg-white rounded-lg">
      <select
        value={sort}
        onChange={handleSortChange}
        className="px-4 py-2 bg-gray-200 text-black rounded-md"
      >
        <option value="latest">Latest</option>
        <option value="popular">Popular</option>
      </select>
      <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        placeholder="Filter with Tags"
        className="px-4 py-2 bg-gray-200 text-black rounded-md"
      />
    </div>
  );
};

export default FilterSort;
