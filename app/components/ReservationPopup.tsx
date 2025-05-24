'use client';

type Props = {
  message: string;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ReservationPopup({ message, visible, onClose, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className="bg-green-600 text-white px-4 py-2 rounded">
            Confirm Order
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
