import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "panel:selectedDomain";

const SelectionContext = createContext(null);

function readStored() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function SelectionProvider({ children }) {
  const [selectedDomain, setSelectedDomainState] = useState(readStored);

  const setSelectedDomain = useCallback((domain) => {
    setSelectedDomainState(domain);
    try {
      if (domain) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(domain));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // sessionStorage unavailable — selection still works for this tab via state
    }
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedDomain, setSelectedDomain }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
