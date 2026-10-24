import { motion } from 'motion/react';
import type { SkillNodeDefinition } from '../../types/skill';
import { BRANCH_INFO } from '../../lib/skillDefinitions';

interface SkillNodeProps {
  node: SkillNodeDefinition;
  unlocked: boolean;
  onClick: () => void;
  isLastInBranch?: boolean;
}

export function SkillNode({ node, unlocked, onClick, isLastInBranch }: SkillNodeProps) {
  const branchInfo = BRANCH_INFO[node.branch];

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
          unlocked
            ? 'border-opacity-100'
            : 'border-command-border opacity-50'
        }`}
        style={{
          backgroundColor: unlocked ? `${branchInfo.color}20` : '#141a12',
          borderColor: unlocked ? branchInfo.color : undefined,
          boxShadow: unlocked ? `0 0 20px ${branchInfo.color}40` : undefined,
        }}
      >
        {unlocked ? node.icon : '🔒'}
      </motion.button>
      <p className={`text-xs mt-2 text-center ${unlocked ? 'text-command-text' : 'text-command-muted'}`}>
        {node.name}
      </p>
      {!isLastInBranch && (
        <div
          className="w-0.5 h-8 my-2"
          style={{
            backgroundColor: unlocked ? branchInfo.color : '#2a3520',
          }}
        />
      )}
    </div>
  );
}
