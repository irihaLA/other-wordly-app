
import React from 'react';
import { View } from '../types';
import { SparklesIcon, BookOpenIcon } from './Icons';
import clsx from 'clsx';

interface HeaderProps {
    view: View;
    setView: (view: View) => void;
    favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({ view, setView, favoriteCount }) => {
  const navButtonClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FDFBF8] focus:ring-gray-800";
  const activeClasses = "bg-gray-800 text-white";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200/80";

  return (
    <header className="text-center w-full mb-8 sm:mb-12">
      <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a1a] font-display tracking-normal">
        Other-Wordly
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        A guide to the world's most untranslatable feelings
      </p>
      <nav className="mt-8 flex justify-center items-center gap-2 p-1.5 bg-gray-100 rounded-full">
        <button 
          onClick={() => setView(View.SEARCH)}
          className={clsx(navButtonClasses, view === View.SEARCH ? activeClasses : inactiveClasses)}
        >
          <SparklesIcon className="w-4 h-4" />
          Search
        </button>
        <button 
          onClick={() => setView(View.FAVORITES)}
          className={clsx(navButtonClasses, view === View.FAVORITES ? activeClasses : inactiveClasses)}
        >
            <BookOpenIcon className="w-4 h-4" />
            My Favorites
            {favoriteCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#F9A88C] rounded-full">{favoriteCount}</span>
            )}
        </button>
      </nav>
    </header>
  );
};
