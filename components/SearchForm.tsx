
import React from 'react';
import { SparklesIcon } from './Icons';

interface SearchFormProps {
  feeling: string;
  setFeeling: (feeling: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onSurpriseMe: () => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ feeling, setFeeling, handleSubmit, isLoading, onSurpriseMe }) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="I feel a quiet joy when I'm home alone..."
          className="w-full p-4 pr-12 text-base text-gray-800 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#F9A88C] focus:border-[#F9A88C] transition-all duration-300 resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
        <button
          type="submit"
          disabled={isLoading || !feeling.trim()}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#1a1a1a] text-white font-bold rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:ring-offset-[#FDFBF8]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
             <>
                <SparklesIcon/>
                Find the Word
             </>
          )}
        </button>
        <button
          type="button"
          onClick={onSurpriseMe}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-white text-[#1a1a1a] font-bold rounded-lg shadow-md border-2 border-gray-200 hover:bg-gray-100 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#FDFBF8]"
        >
            Surprise Me
        </button>
      </div>
    </form>
  );
};
