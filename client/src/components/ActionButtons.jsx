import React, { useState } from "react";
import PasswordModal from "./PasswordModal";
import { verifyPassword } from "../api";

export default function ActionButtons({ loading, onFetch, onAnalyze }) {
  const [pendingAction, setPendingAction] = useState(null); // "fetch" | "analyze" | null
  const [authLoading, setAuthLoading]     = useState(false);
  const [authError, setAuthError]         = useState(null);

  const openModal = (action) => {
    setAuthError(null);
    setPendingAction(action);
  };

  const handleCancel = () => {
    setPendingAction(null);
    setAuthError(null);
  };

  const handleConfirm = async (password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await verifyPassword(password);
      setPendingAction(null);
      if (pendingAction === "fetch")   onFetch();
      if (pendingAction === "analyze") onAnalyze();
    } catch (err) {
      const msg = err?.response?.data?.error || "Incorrect password. Please try again.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={() => openModal("fetch")}
          disabled={loading.fetch}
          className="flex items-center gap-2 bg-gc-blue hover:bg-gc-blue/80 disabled:bg-gc-blue/20 disabled:text-gc-blue/40
            text-white text-sm font-medium px-5 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          {loading.fetch ? (
            <>
              <Spinner />
              Fetching...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Fetch Reddit Posts
            </>
          )}
        </button>

        <button
          onClick={() => openModal("analyze")}
          disabled={loading.analyze}
          className="flex items-center gap-2 bg-gc-orange hover:bg-gc-orange/80 disabled:bg-gc-orange/20 disabled:text-gc-orange/40
            text-white text-sm font-medium px-5 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        >
          {loading.analyze ? (
            <>
              <Spinner />
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analyze with AI
            </>
          )}
        </button>

        <div className="ml-auto text-xs text-slate-500 dark:text-slate-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {pendingAction && (
        <PasswordModal
          action={pendingAction}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          loading={authLoading}
          error={authError}
        />
      )}
    </>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
