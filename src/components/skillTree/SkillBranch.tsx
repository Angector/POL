import { SkillNode } from './SkillNode';
import type { SkillBranch as SkillBranchType } from '../../types/skill';
import { BRANCH_INFO } from '../../lib/skillDefinitions';

interface SkillBranchProps {
  branch: SkillBranchType;
  nodes: any[];
  onSelect: (node: any) => void;
}

export function SkillBranch({ branch, nodes, onSelect }: SkillBranchProps) {
  const branchInfo = BRANCH_INFO[branch];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <div className="text-3xl mb-1">{branchInfo.icon}</div>
        <h3
          className="text-lg font-bold font-[family-name:var(--font-serif-epic)]"
          style={{ color: branchInfo.color }}
        >
          {branchInfo.label}
        </h3>
      </div>
      <div className="flex flex-col items-center">
        {nodes.map((node, index) => (
          <SkillNode
            key={node.key}
            node={node}
            unlocked={(node as any).unlocked}
            onClick={() => onSelect(node)}
            isLastInBranch={index === nodes.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
