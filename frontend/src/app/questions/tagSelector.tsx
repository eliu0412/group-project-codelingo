import React, { useEffect, useState, useMemo } from "react";
import { getAllTags } from "./problemApi";

interface Tag {
  tag: string;
  count: number;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagToggle }) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setAvailableTags([]);
      }
    };
    fetchTags();
  }, []);

  const filteredTags = useMemo(() => {
    return availableTags
      .filter(
        (tag) =>
          tag.tag &&
          tag.tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedTags.includes(tag.tag)
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [availableTags, searchQuery, selectedTags]);

  return (
    <div className="pt-10 relative w-full max-w-md">
      <div className="pt-10 flex flex-row justify-between gap-20 items-center">
      <label className="text-white text-lg min-w-max">Tags:</label>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onFocus={() => setDropdownOpen(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block py-2.5 px-0 w-3/4 bg-gray-900
             text-lg text-gray-400 border-0 border-b-2 
             border-gray-200 appearance-none dark:text-gray-400
             dark:border-gray-700 focus:outline-none focus:ring-0
             focus:border-gray-200 peer flex justify-center"
        />

        {dropdownOpen && (
          <div
            className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {filteredTags.length === 0 ? (
              <div className="p-2 text-gray-500">No matching tags</div>
            ) : (
              filteredTags.map((tag) => (
                <div
                  key={tag.tag}
                  onClick={() => {
                    onTagToggle(tag.tag);
                  }}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {tag.tag} {tag.count > 5 && "🔥"}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      </div>

      <div className="selected-tags flex flex-wrap gap-2 mt-3">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
            onClick={() => onTagToggle(tag)}
          >
            {tag} ✕
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
