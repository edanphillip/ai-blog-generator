//app/page.tsx
'use client';
import React from 'react';
import { acceptedStreamModels } from "../types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function ModelSelectDropdown(props: { selectedModel: acceptedStreamModels; setSelectedModel: React.Dispatch<React.SetStateAction<acceptedStreamModels>>; }) {
  function handleValueChange(value: acceptedStreamModels) {
    props.setSelectedModel(value);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Select AI Model: {props.selectedModel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={props.selectedModel} onValueChange={(e) => handleValueChange(e as acceptedStreamModels)}>
          <DropdownMenuRadioItem value="gpt-4-1106-preview">GPT-4</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gpt-3.5-turbo-16k-0613">GPT-3.5</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
