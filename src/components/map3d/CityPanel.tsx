import { motion, AnimatePresence } from 'motion/react';
import type { TileWithPosition } from '../../types/tile';
import { formatDate } from '../../lib/format';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface CityPanelProps {
  tile: TileWithPosition | null;
  onClose: () => void;
}

export function CityPanel({ tile, onClose }: CityPanelProps) {
  return (
    <AnimatePresence>
      {tile && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-command-panel border-l border-command-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-command-bg border border-command-border text-command-muted hover:text-command-text transition-colors flex items-center justify-center"
                aria-label="بستن"
              >
                ✕
              </button>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
                  {tile.name}
                </h2>
                {tile.name_meaning && (
                  <p className="text-sm text-command-muted italic mb-4">
                    {tile.name_meaning}
                  </p>
                )}

                <div className="mb-6">
                  <Badge
                    color={
                      tile.status === 'freed'
                        ? 'olive'
                        : tile.status === 'fighting'
                        ? 'crimson'
                        : 'muted'
                    }
                  >
                    {tile.status === 'freed'
                      ? '🏰 آزاد'
                      : tile.status === 'fighting'
                      ? '⚔️ در نبرد'
                      : '🔒 قفل'}
                  </Badge>
                </div>

                {tile.status === 'freed' && (
                  <Card className="mb-4">
                    <h3 className="text-sm font-bold text-command-amber mb-2">
                      تاریخ فتح
                    </h3>
                    {tile.freed_at && (
                      <p className="text-sm text-command-text">
                        {formatDate(tile.freed_at)}
                      </p>
                    )}
                    {tile.freed_cycle && (
                      <p className="text-xs text-command-muted mt-1">
                        دور {tile.freed_cycle}
                      </p>
                    )}
                  </Card>
                )}

                {tile.journal_entry && (
                  <Card className="mb-4">
                    <h3 className="text-sm font-bold text-command-amber mb-2">
                      ژورنال
                    </h3>
                    <p className="text-sm text-command-text leading-relaxed">
                      {tile.journal_entry}
                    </p>
                  </Card>
                )}

                {tile.status === 'locked' && (
                  <Card>
                    <p className="text-sm text-command-muted leading-relaxed">
                      این سرزمین هنوز در دست دشمن است. با پایداری، آزادش کن.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
