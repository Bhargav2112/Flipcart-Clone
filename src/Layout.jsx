import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const NO_LAYOUT_PAGES = ['AdminPanel', 'SellerDashboard'];

export default function Layout({ children, currentPageName }) {
  const hideLayout = NO_LAYOUT_PAGES.includes(currentPageName);

  if (hideLayout) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F3F6]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}