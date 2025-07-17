"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";

export function Search() {
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    if (!inputRef.current?.value) {
      setIsExpanded(false);
    }
  };

  if (!isClient) {
    return (
      <Form action="/search" className="relative items-center hidden sm:flex">
        <div className="flex items-center transition-all duration-300 w-auto">
          <Button
            type="button"
            variant="ghost"
            className="flex h-9 items-center justify-center"
          >
            <SearchIcon className="h-4" />
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form action="/search" className="relative items-center hidden sm:flex">
      <div
        className={`flex items-center transition-all duration-300 ${
          isExpanded ? "w-full lg:w-80 xl:w-full" : "w-auto"
        }`}
      >
        {isExpanded && (
          <Input
            ref={inputRef}
            key={searchParams?.get("q")}
            type="text"
            name="q"
            placeholder="Search for products..."
            autoComplete="off"
            defaultValue={searchParams?.get("q") || ""}
            onBlur={handleInputBlur}
          />
        )}
        <Button
          type={isExpanded ? "button" : "button"}
          variant={"ghost"}
          onClick={!isExpanded ? handleSearchIconClick : undefined}
          className={`flex h-9 items-center justify-center ${
            isExpanded ? "absolute right-0 top-0" : ""
          }`}
        >
          <SearchIcon className="h-4" />
        </Button>
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <Input placeholder="Search for products..." />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}
