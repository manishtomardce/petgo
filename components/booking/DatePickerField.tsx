"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type DatePickerFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  value?: string;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export default function DatePickerField({
  name,
  label,
  required = false,
  value = "",
}: DatePickerFieldProps) {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selected, setSelected] = useState<Date | undefined>(
    value ? parseDateString(value) : undefined
  );
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInputValue(value);
    setSelected(value ? parseDateString(value) : undefined);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="relative">
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          {label}
        </label>
        <div className="flex w-full items-center justify-between rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-left text-[16px] text-neutral-400">
          <span>{value || "YYYY-MM-DD"}</span>
          <span className="text-neutral-500">📅</span>
        </div>
        <input type="hidden" name={name} value={value} required={required} />
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-left text-[16px] text-neutral-900 outline-none focus:border-[#CF8750]"
      >
        <span className={inputValue ? "text-neutral-900" : "text-neutral-400"}>
          {inputValue || "YYYY-MM-DD"}
        </span>
        <span className="text-neutral-500">📅</span>
      </button>

      <input type="hidden" name={name} value={inputValue} required={required} />

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl sm:left-auto sm:right-auto sm:min-w-[320px]">
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected ?? new Date()}
            onSelect={(date) => {
              if (!date) return;
              setSelected(date);
              setInputValue(formatDate(date));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}