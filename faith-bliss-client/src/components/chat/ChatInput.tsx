import { Send } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "../ui/input-group";
import { useState } from "react";

export default function ChatInput({
  handleInput,
}: {
  handleInput: (input: string) => void;
}) {
  // State that manages Input value in real time
  const [input, setInput] = useState("");
  return (
    <div className=" fixed min-h-24 p-7 pt-0  bottom-0 left-0 right-0">
      <InputGroup className="h-full">
        <InputGroupTextarea
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleInput(input);
              setInput("");
            }
          }}
          className="text-gray-300"
          onChange={(e) => {
            const value = e.target.value;

            if (value.length) {
              // Capitalize first letter of first word
              const capitalizedFirstLetter = value
                .split(" ")
                .at(0)
                ?.at(0)
                ?.toUpperCase();
              const modifiedValue = capitalizedFirstLetter + value.slice(1);
              console.log(modifiedValue);
              setInput(modifiedValue);
              return;
            }

            setInput(value);
          }}
          placeholder="Your message"
        />
        <InputGroupAddon
          onClick={() => {
            handleInput(input);
            setInput("");
          }}
          className="cursor-pointer"
          align="inline-end"
        >
          <Send />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
