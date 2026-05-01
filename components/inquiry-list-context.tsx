"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INQUIRY_LIST_STORAGE_KEY,
  loadInquiryListFromStorage,
  type InquiryListItem,
  type ProductSnapshotInput,
  snapshotToLine,
} from "@/lib/inquiry-list";

type InquiryListContextValue = {
  items: InquiryListItem[];
  itemCount: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (product: ProductSnapshotInput) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
};

const InquiryListContext = createContext<InquiryListContextValue | null>(null);

function persist(next: InquiryListItem[]) {
  try {
    localStorage.setItem(INQUIRY_LIST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function InquiryListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryListItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(loadInquiryListFromStorage());
  }, []);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === INQUIRY_LIST_STORAGE_KEY) {
        setItems(loadInquiryListFromStorage());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, row) => sum + row.quantity, 0), [items]);

  const applyItems = useCallback((updater: (prev: InquiryListItem[]) => InquiryListItem[]) => {
    setItems((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const addItem = useCallback(
    (product: ProductSnapshotInput) => {
      const base = snapshotToLine(product);
      applyItems((prev) => {
        const idx = prev.findIndex((row) => row.id === base.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [...prev, { ...base, quantity: 1 }];
      });
    },
    [applyItems],
  );

  const removeItem = useCallback(
    (id: number) => {
      applyItems((prev) => prev.filter((row) => row.id !== id));
    },
    [applyItems],
  );

  const setQuantity = useCallback(
    (id: number, quantity: number) => {
      const q = Math.max(1, Math.floor(quantity) || 1);
      applyItems((prev) => prev.map((row) => (row.id === id ? { ...row, quantity: q } : row)));
    },
    [applyItems],
  );

  const clear = useCallback(() => {
    applyItems(() => []);
  }, [applyItems]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((o) => !o), []);

  const value = useMemo(
    () =>
      ({
        items,
        itemCount,
        drawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        removeItem,
        setQuantity,
        clear,
      }) satisfies InquiryListContextValue,
    [
      items,
      itemCount,
      drawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addItem,
      removeItem,
      setQuantity,
      clear,
    ],
  );

  return <InquiryListContext.Provider value={value}>{children}</InquiryListContext.Provider>;
}

export function useInquiryList() {
  const ctx = useContext(InquiryListContext);
  if (!ctx) {
    throw new Error("useInquiryList must be used within InquiryListProvider");
  }
  return ctx;
}
