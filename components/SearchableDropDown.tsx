import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XCircle } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  placeholder: string;
  onSelect: (selected: string) => void;
  value: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  placeholder,
  onSelect,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSelect(""); // Clear the selected value when typing
    setIsOpen(true);
  };

  const handleOptionSelect = (option: Option) => {
    onSelect(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onSelect("");
    setSearchTerm("");
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm || (selectedOption ? selectedOption.label : "")}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          className="w-full pr-8"
        />
        {(value || searchTerm) && (
          <button
            onClick={clearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full">
          <ScrollArea className="mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                onClick={() => handleOptionSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
