import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Simple, dependency-free toast system.
 * PUBLIC_INTERFACE
 * showToast(message: string, type?: 'info'|'success'|'error')
 */
const ToastContext = createContext(null);

// PUBLIC_INTERFACE
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let counter = 0;

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", timeout = 2600) => {
    const id = `${Date.now()}_${counter++}`;
    setToasts((ts) => [...ts, { id, message, type }]);
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout);
    }
  }, [remove]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status" aria-live="polite">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
