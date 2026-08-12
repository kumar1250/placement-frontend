const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const INTERVIEW_TYPES = ["Technical", "HR", "Behavioral", "Mixed"];
const QUESTION_COUNTS = [5, 10, 15];

function OptionGroup({ label, options, value, onChange, renderOption }) {
  return (
    <fieldset>
      <legend className="font-mono text-xs uppercase tracking-wide text-paper-muted">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-paper-border bg-white/50 text-ink hover:border-brass"
              }`}
            >
              {renderOption ? renderOption(opt) : opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function InterviewSetupForm({ difficulty, interviewType, numberOfQuestions, onChange }) {
  return (
    <div className="flex flex-col gap-7">
      <OptionGroup
        label="Difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={(v) => onChange({ difficulty: v })}
      />
      <OptionGroup
        label="Interview type"
        options={INTERVIEW_TYPES}
        value={interviewType}
        onChange={(v) => onChange({ interviewType: v })}
      />
      <OptionGroup
        label="Number of questions"
        options={QUESTION_COUNTS}
        value={numberOfQuestions}
        onChange={(v) => onChange({ numberOfQuestions: v })}
        renderOption={(n) => `${n} questions`}
      />
    </div>
  );
}
