"use client";
export const Select = ({
  options,
  onSelect,
  value,
}: {
  onSelect: (value: string) => void;
  value: string;
  options: string[];
}) => {
  return (
    <select
      onChange={(e) => {
        onSelect(e.target.value);
      }}
      value={value}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
};
