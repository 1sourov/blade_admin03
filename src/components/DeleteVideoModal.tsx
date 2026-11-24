import { useEffect, useState } from 'react';
import { Archive, Trash2 } from 'lucide-react';
import { getPreferences } from '../lib/supabaseClient';
import type { DeletionStrategy, VideoStatus } from '../types/blade';
import { ConfirmModal } from './ui/ConfirmModal';

export interface DeleteVideoTarget {
  id: string;
  caption?: string;
  status?: VideoStatus;
}

interface DeleteVideoModalProps {
  open: boolean;
  videos: DeleteVideoTarget[];
  loading?: boolean;
  subtitle?: string;
  onConfirm: (strategy: DeletionStrategy) => void;
  onCancel: () => void;
}

export function DeleteVideoModal({
  open,
  videos,
  loading = false,
  subtitle,
  onConfirm,
  onCancel,
}: DeleteVideoModalProps) {
  const allAlreadySoftDeleted =
    videos.length > 0 && videos.every((v) => v.status === 'deleted');

  const [strategy, setStrategy] = useState<DeletionStrategy>(() =>
    allAlreadySoftDeleted ? 'hard' : getPreferences().deletionStrategy
  );

  useEffect(() => {
    if (!open) return;
    setStrategy(allAlreadySoftDeleted ? 'hard' : getPreferences().deletionStrategy);
  }, [open, allAlreadySoftDeleted]);

  if (!open || videos.length === 0) return null;

  const isBulk = videos.length > 1;
  const firstLabel = videos[0]?.caption?.trim() || videos[0]?.id || 'this video';

  const title = isBulk
    ? `Delete ${videos.length} Videos`
    : allAlreadySoftDeleted
    ? 'Permanently Delete Video'
    : 'Delete Video';

  const description =
    subtitle ||
    (isBulk
      ? `Choose how to delete the ${videos.length} selected videos. This updates the live Supabase database immediately.`
      : allAlreadySoftDeleted
      ? `"${firstLabel}" is already in Deleted. Permanently deleting it will remove the database record and stored media files.`
      : `Choose how to delete "${firstLabel}". Soft delete keeps the record recoverable; permanent delete removes the database row and Storage media.`);

  return (
    <ConfirmModal
      open={open}
      title={title}
      description={description}
      confirmLabel={
        strategy === 'hard'
          ? isBulk
            ? `Delete ${videos.length} Permanently`
            : 'Delete Permanently'
          : isBulk
          ? `Move ${videos.length} to Deleted`
          : 'Move to Deleted'
      }
      destructive={strategy === 'hard'}
      loading={loading}
      onConfirm={() => onConfirm(strategy)}
      onCancel={onCancel}
    >
      <div className="space-y-2.5">
        {!allAlreadySoftDeleted && (
          <label
            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
              strategy === 'soft'
                ? 'border-zinc-950 bg-zinc-50'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="video-delete-strategy"
              value="soft"
              checked={strategy === 'soft'}
              onChange={() => setStrategy('soft')}
              className="mt-0.5 accent-zinc-950"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-950">
                <Archive className="w-3.5 h-3.5 text-zinc-600" />
                Soft Delete (Recoverable)
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                Marks {isBulk ? 'videos' : 'the video'} as deleted and hides from the Android
                public feed while keeping database rows and Storage files recoverable under the
                Deleted tab.
              </p>
            </div>
          </label>
        )}

        <label
          className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
            strategy === 'hard'
              ? 'border-red-600 bg-red-50/50'
              : 'border-zinc-200 hover:border-zinc-300 bg-white'
          }`}
        >
          <input
            type="radio"
            name="video-delete-strategy"
            value="hard"
            checked={strategy === 'hard'}
            onChange={() => setStrategy('hard')}
            className="mt-0.5 accent-red-600"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              Delete Permanently (DB + Storage)
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
              Permanently removes {isBulk ? 'the selected video records' : 'the video record'},
              cleans up related comments &amp; likes, and deletes video and thumbnail files from
              Supabase Storage. Cannot be undone.
            </p>
          </div>
        </label>
      </div>
    </ConfirmModal>
  );
}
