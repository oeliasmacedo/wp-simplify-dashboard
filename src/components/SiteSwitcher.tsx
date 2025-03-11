
import { useState } from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for website list
const websites = [
  {
    value: "example-one",
    label: "Example Site One",
    url: "example-one.com"
  },
  {
    value: "example-two",
    label: "Example Site Two",
    url: "example-two.com"
  },
  {
    value: "example-three",
    label: "Example Site Three",
    url: "example-three.com"
  },
];

export function SiteSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(websites[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            <span className="font-medium">{selectedSite.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search site..." />
          <CommandEmpty>No site found.</CommandEmpty>
          <CommandGroup heading="My Websites">
            {websites.map((site) => (
              <CommandItem
                key={site.value}
                value={site.value}
                onSelect={() => {
                  setSelectedSite(site);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSite.value === site.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{site.label}</span>
                  <span className="text-xs text-muted-foreground">{site.url}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
