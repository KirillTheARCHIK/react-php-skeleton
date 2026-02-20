import { useState } from "react";
import { nanoid } from "nanoid";

export default function useId() {
  const [id] = useState(() => nanoid());
  return id;
}
