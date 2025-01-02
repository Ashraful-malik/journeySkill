"use client";
import React, { useState } from "react";
import { Input } from "./input";
import { X } from "lucide-react";
import { Badge } from "./badge";

function TagInput({ value, onChange, placeholder = "Add tags..." }) {
  const [input, setInput] = useState("");
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    }
  };
  const addTag = () => {
    let trimmedInput = input.trim().toLowerCase().replace(/\s+/g, "");
    if (trimmedInput && !value.includes(trimmedInput)) {
      if (!trimmedInput.startsWith("#")) {
        trimmedInput = "#" + trimmedInput;
      }
      onChange([...value, trimmedInput]); // Update form state
      setInput("");
    }
  };
  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1">
      {value.map((tag, idx) => (
        <Badge
          key={idx}
          variant="secondary"
          className="flex items-center gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
          onClick={() => removeTag(tag)}
        >
          {tag}
          <X size={12} className="opacity-75" />
        </Badge>
      ))}
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

export default TagInput;
