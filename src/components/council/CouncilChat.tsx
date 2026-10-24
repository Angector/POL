import { useRef, useEffect } from 'react';
import { useCouncil } from '../../hooks/useCouncil';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { TypingIndicator } from './TypingIndicator';
import { ADVISORS } from '../../lib/advisorConstants';
import type { Advisor } from '../../types/council';

interface CouncilChatProps {
  advisor: Advisor;
}

export function CouncilChat({ advisor }: CouncilChatProps) {
  const { messagesByAdvisor, sending, send, clearHistory } = useCouncil();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const advisorInfo = ADVISORS.find((a) => a.key === advisor)!;
  const messages = messagesByAdvisor[advisor];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearHistory = () => {
    if (confirm('آیا از پاک کردن تاریخچه مطمئن هستید؟')) {
      clearHistory(advisor);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-command-panel border border-command-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-command-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{advisorInfo.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
              {advisorInfo.nameFa}
            </h3>
            <p className="text-xs text-command-muted">{advisorInfo.name}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs text-command-muted hover:text-command-crimson transition-colors"
          >
            پاک کردن تاریخچه
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" role="log" aria-label="تاریخچه گفتگو">
        {messages.length === 0 ? (
          <div className="text-center text-command-muted py-8">
            <p className="text-lg mb-2">{advisorInfo.icon}</p>
            <p>{advisorInfo.welcomeMessage}</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {sending && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <QuickActions
            actions={advisorInfo.quickActions}
            onSelect={(action) => send(advisor, action)}
            disabled={sending}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-command-border">
        <ChatInput
          onSend={(message) => send(advisor, message)}
          disabled={sending}
          placeholder={`با ${advisorInfo.nameFa} صحبت کنید...`}
        />
      </div>
    </div>
  );
}
