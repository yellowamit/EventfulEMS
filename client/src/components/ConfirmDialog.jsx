/* eslint-disable react/prop-types */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded px-4 py-2 font-bold text-white ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primarydark"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
