import { motion } from 'motion/react';
import type { CouncilMessage } from '../../types/council';
import { ADVISORS } from '../../lib/advisorConstants';
import { formatRelativeTime } from '../../lib/format';

interface ChatMessageProps {
  message: CouncilMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const advisorInfo = ADVISORS.find((a) => a.key === message.advisor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && advisorInfo && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{advisorInfo.icon}</span>
            <span className="text-xs text-command-muted">{advisorInfo.nameFa}</span>
          </div>
        )}
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-command-olive/20 border border-command-olive'
              : 'bg-command-panel border border-command-border'
          }`}
        >
          <p className="text-sm text-command-text whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <p className="text-xs text-command-muted mt-1">
          {formatRelativeTime(message.created_at)}
        </p>
      </div>
    </motion.div>
  );
}
