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
          onChange={(e) => setInput(e.target.value)}
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
