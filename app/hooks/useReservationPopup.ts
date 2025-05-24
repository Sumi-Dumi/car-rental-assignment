'use client';

import { useState } from 'react';

export function useReservationPopup() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showPopup = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  const hidePopup = () => {
    setVisible(false);
    setMessage('');
  };

  return {
    visible,
    message,
    showPopup,
    hidePopup,
  };
}
