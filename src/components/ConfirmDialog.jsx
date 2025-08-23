import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function ConfirmDialog({ show, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar' }) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (show) {
      lastFocusedRef.current = document.activeElement;
      cancelButtonRef.current?.focus();
    } else {
      lastFocusedRef.current?.focus();
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onCancel();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [show, onCancel]);

  const handleClickOutside = (e) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  if (!show) return null;

  return createPortal(
    (
      <dialog ref={dialogRef} open onClick={handleClickOutside} className="modal" aria-modal="true">
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
    ),
    document.body
  );
}

export default ConfirmDialog;
