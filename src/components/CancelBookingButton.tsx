import { useState } from "react";

export function CancelBookingButton({ title, onCancel }: { title: string; onCancel: () => void }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <button type="button" className="button button-ghost button-danger" onClick={() => setIsConfirming(true)}>
        Cancel booking
      </button>
    );
  }

  return (
    <div className="confirm-cancel" role="group" aria-label={`Cancel ${title}?`}>
      <p>Cancel this stay? This can't be undone.</p>
      <div className="confirm-cancel-actions">
        <button type="button" className="button button-danger-solid" onClick={onCancel}>
          Yes, cancel
        </button>
        <button type="button" className="button button-ghost" onClick={() => setIsConfirming(false)} autoFocus>
          Keep it
        </button>
      </div>
    </div>
  );
}
