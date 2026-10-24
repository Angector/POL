interface InviteCodeFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function InviteCodeForm({ value, onChange, disabled }: InviteCodeFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const filtered = e.target.value.replace(/[^0-9]/g, '');
    onChange(filtered);
  };

  return (
    <div>
      <label
        htmlFor="inviteCode"
        className="block text-sm text-command-muted mb-2"
      >
        کد دعوت
      </label>
      <input
        id="inviteCode"
        type="text"
        inputMode="numeric"
        maxLength={6}
        pattern="[0-9]{6}"
        dir="ltr"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="۰۰۰۰۰۰"
        className="w-full bg-command-bg border border-command-border rounded px-4 py-3 text-center text-lg text-command-text font-[family-name:var(--font-mono-hud)] tracking-widest focus:outline-none focus:border-command-amber disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  );
}
