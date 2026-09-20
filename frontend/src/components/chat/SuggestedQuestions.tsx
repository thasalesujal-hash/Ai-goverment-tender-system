import { Button } from "../common/Button";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <Button key={q} variant="outline" size="sm" onClick={() => onSelect(q)}>
          {q}
        </Button>
      ))}
    </div>
  );
}
