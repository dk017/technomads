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
  onInput: (input: string) => void;
  value: string;
}
const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  placeholder,
  onSelect,
  onInput,
  value,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFilteredOptions(
      options
        .filter((option) =>
          option.label.toLowerCase().includes(value.toLowerCase())
        )
        .map((option) => option.label)
    );
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onInput(newValue); // Just update the input value
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    onSelect(option); // Trigger the search only when an option is selected
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full bg-background text-foreground"
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-foreground"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
