import React, { useEffect, useRef } from 'react';

function ConfirmDialog({ show, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar' }) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (show) {
      lastFocusedRef.current = document.activeElement;
      if (!dialog.open) dialog.showModal();
      cancelButtonRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
      lastFocusedRef.current?.focus();
    }
  }, [show]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onCancel();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onCancel]);

  const handleClickOutside = (e) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  return (
    <dialog ref={dialogRef} onClick={handleClickOutside} className="modal" aria-modal="true">
      <div className="modal-content bg-dark text-white">
        <div className="modal-body">
          {message}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            ref={cancelButtonRef}
            className="btn btn-outline-light"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
