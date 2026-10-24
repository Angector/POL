interface QuickActionsProps {
  actions: string[];
  onSelect: (action: string) => void;
  disabled?: boolean;
}

export function QuickActions({ actions, onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          disabled={disabled}
          className="px-3 py-1.5 bg-command-panel border border-command-border rounded-full text-sm text-command-text hover:border-command-amber hover:text-command-amber transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
