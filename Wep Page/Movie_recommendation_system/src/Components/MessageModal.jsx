import React, { useEffect } from 'react';
import './MessageModal.css';

const MessageModal = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`message-modal ${type}`}>
      {message}
    </div>
  );
};

export default MessageModal;
