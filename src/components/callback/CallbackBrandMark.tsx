import { MessageSquare } from 'lucide-react';

export default function CallbackBrandMark() {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
        <MessageSquare className="w-4 h-4 text-primary-600" />
      </div>
      <span className="font-display font-bold text-base text-text">
        ReTiCh
      </span>
    </div>
  );
}
