"use client";
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function MultiSelect({
  options,
  selected,
  setSelected,
  placeholder,
  label,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
            role="combobox"
            aria-expanded={open}
          >
            {selected.length === 0 ? (
              <span className="text-gray-400">
                {placeholder || "Selecionar..."}
              </span>
            ) : selected.length <= 2 ? (
              selected.join(", ")
            ) : (
              <>
                {selected.slice(0, 1).join(", ")}{" "}
                <span className="text-gray-400">
                  +{selected.length - 1} selecionados
                </span>
              </>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[180px] p-0">
          <Command>
            <CommandGroup className="dark:bg-verde-escuro">
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                  className="cursor-pointer"
                >
                  <Check
                    className={
                      selected.includes(option)
                        ? "mr-2 h-4 w-4 opacity-100"
                        : "mr-2 h-4 w-4 opacity-0"
                    }
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
