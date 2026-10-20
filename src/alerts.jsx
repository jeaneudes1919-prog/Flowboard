import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Info, Undo2, X } from "lucide-react";

const TONES = {
  success: {
    color: "#34D399",
    soft: "rgba(52, 211, 153, 0.14)",
    border: "rgba(52, 211, 153, 0.28)",
    icon: Check,
    label: "Succès",
  },
  danger: {
    color: "#FB7185",
    soft: "rgba(251, 113, 133, 0.14)",
    border: "rgba(251, 113, 133, 0.28)",
    icon: AlertTriangle,
    label: "Attention",
  },
  info: {
    color: "#818CF8",
    soft: "rgba(129, 140, 248, 0.14)",
    border: "rgba(129, 140, 248, 0.28)",
    icon: Info,
    label: "Information",
  },
};

export function Toast({ toast, onClose }) {
  const tone = TONES[toast.tone] ?? TONES.info;
  const Icon = tone.icon;
  const duration = toast.duration ?? 5000;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="fixed inset-x-4 bottom-5 z-[100] mx-auto w-auto max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#111124]/95 text-white shadow-[0_24px_80px_-16px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0 sm:w-[390px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(280px circle at 0% 0%, ${tone.soft}, transparent 72%)`,
        }}
      />
      <div className="relative flex items-start gap-3 p-4 pr-3">
        <span
          className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border"
          style={{ background: tone.soft, borderColor: tone.border, color: tone.color }}
        >
          <Icon size={17} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: tone.color }}>
            {toast.eyebrow ?? tone.label}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-xs leading-relaxed text-white/55">{toast.message}</p>
          ) : null}
          {toast.undo ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                toast.undo();
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-indigo-300/20 bg-indigo-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-200 transition hover:bg-indigo-400/20"
            >
              <Undo2 size={13} aria-hidden="true" />
              Annuler l'action
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la notification"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/35 transition hover:bg-white/10 hover:text-white/80"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
        style={{ background: tone.color }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onClose,
  icon: Icon = AlertTriangle,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      className="fixed inset-0 z-[110] grid place-items-center bg-[#070712]/75 p-4 backdrop-blur-md"
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        initial={{ opacity: 0, y: 22, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#121226] p-6 text-white shadow-[0_40px_120px_-24px_rgba(0,0,0,0.95)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl"
        />

        <div className="relative">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-rose-400/25 bg-rose-400/10 text-rose-300">
            <Icon size={20} aria-hidden="true" />
          </span>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-300/80">
            Confirmation requise
          </p>
          <h2 id="confirm-title" className="mt-2 text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <p id="confirm-description" className="mt-2 text-sm leading-relaxed text-white/55">
            {message}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(244,63,94,0.8)] transition hover:bg-rose-400 active:scale-[0.98]"
            >
              {confirmLabel}
            </button>
          </div>
          <p className="mt-3 text-right text-[10px] text-white/30">Échap pour fermer</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
