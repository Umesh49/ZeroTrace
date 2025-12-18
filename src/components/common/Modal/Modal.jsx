import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import './Modal.css';

const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const Modal = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText,
    onConfirm,
    onCancel,
    closeOnBackdrop = true
}) => {
    const Icon = iconMap[type] || Info;

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className={`modal-container modal-${type}`}>
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className="modal-icon">
                    <Icon size={48} />
                </div>

                <h2 id="modal-title" className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>

                <div className="modal-actions">
                    {cancelText && (
                        <button
                            className="modal-btn modal-btn-secondary"
                            onClick={onCancel || onClose}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        className="modal-btn modal-btn-primary"
                        onClick={onConfirm || onClose}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    closeOnBackdrop: PropTypes.bool,
};

export default Modal;
