'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/redux/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This function only runs ONCE on initial render
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}