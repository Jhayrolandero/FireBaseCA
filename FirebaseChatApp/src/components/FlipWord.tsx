import { FlipWords } from "../../@/components/ui/flip-words";

export function FlipWordsComponent() {
  const words = ["Topics", "Friends", "Network"];

  return (
    <div className="flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
        Find <FlipWords words={words} /> With FireChat
      </div>
    </div>
  );
}
