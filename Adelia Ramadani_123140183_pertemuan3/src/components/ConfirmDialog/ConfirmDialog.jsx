import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function ConfirmDialog({ title, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="delete-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <p className="eyebrow">RAPIKAN RAKMU</p>
      <h2 id="delete-title">Hapus buku ini?</h2>
      <p>“{title}” akan dihapus dari koleksi Anda.</p>
      <div className="dialog-actions">
        <button autoFocus className="button secondary" onClick={onCancel}>
          Batal
        </button>
        <button className="button primary" onClick={onConfirm}>
          Ya, hapus buku
        </button>
      </div>
    </dialog>
  );
}
ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
