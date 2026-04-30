import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import SkillPower from './SkillPower';

export default function SkillPowerWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open SkillPower AI"
        className="fixed top-20 right-4 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-end p-4 overflow-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-gray-50 rounded-xl shadow-2xl mt-16 mr-2 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
            <SkillPower />
          </div>
        </div>
      )}
    </>
  );
}
