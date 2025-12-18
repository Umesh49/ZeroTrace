import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/common/Modal/Modal';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        confirmText: 'OK',
        cancelText: null,
        onConfirm: null,
        onCancel: null,
    });

    const showModal = useCallback(({
        title,
        message,
        type = 'info',
        confirmText = 'OK',
        cancelText = null,
        onConfirm = null,
        onCancel = null,
    }) => {
        setModalState({
            isOpen: true,
            title,
            message,
            type,
            confirmText,
            cancelText,
            onConfirm,
            onCancel,
        });
    }, []);

    const hideModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Convenience methods
    const showSuccess = useCallback((title, message, options = {}) => {
        showModal({ title, message, type: 'success', ...options });
    }, [showModal]);

    const showError = useCallback((title, message, options = {}) => {
        showModal({ title, message, type: 'error', ...options });
    }, [showModal]);

    const showWarning = useCallback((title, message, options = {}) => {
        showModal({ title, message, type: 'warning', ...options });
    }, [showModal]);

    const showInfo = useCallback((title, message, options = {}) => {
        showModal({ title, message, type: 'info', ...options });
    }, [showModal]);

    const handleConfirm = () => {
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
        hideModal();
    };

    const handleCancel = () => {
        if (modalState.onCancel) {
            modalState.onCancel();
        }
        hideModal();
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal, showSuccess, showError, showWarning, showInfo }}>
            {children}
            <Modal
                isOpen={modalState.isOpen}
                onClose={hideModal}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                closeOnBackdrop={true}
            />
        </ModalContext.Provider>
    );
};

export default ModalContext;
