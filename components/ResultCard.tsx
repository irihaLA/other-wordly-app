
import React, { forwardRef } from 'react';
import { UntranslatableWord } from '../types';
import { HeartIcon, SpeakerIcon } from './Icons';

interface ResultCardProps {
  word: UntranslatableWord;
  backgroundImage: string | null;
  isGeneratingImage: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPronounce: () => void;
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(({ word, backgroundImage, isGeneratingImage, isFavorite, onToggleFavorite, onPronounce }, ref) => {
  const getNativeFontClass = (language: string) => {
    switch(language.toLowerCase()) {
      case 'japanese': return 'font-noto-jp';
      case 'arabic': return 'font-noto-arabic';
      default: return 'font-serif';
    }
  };

  const cardStyle = backgroundImage ? { 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {};

  return (
    <div
      ref={ref}
      id="result-card"
      style={cardStyle}
      className="w-full max-w-md bg-[#FDFBF8] p-2 sm:p-3 border border-gray-200/80 shadow-lg rounded-xl flex flex-col justify-between aspect-[3/4] overflow-hidden transition-all duration-500"
    >
      <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfbf8]/80 backdrop-blur-sm rounded-lg transition-all duration-500">
        
        <button
            onClick={onToggleFavorite}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#F9A88C] transition-colors z-20"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <HeartIcon isFilled={isFavorite} className={`w-7 h-7 ${isFavorite ? 'text-[#F9A88C]' : ''}`} />
        </button>

        {isGeneratingImage && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
            <svg className="animate-spin h-8 w-8 text-[#F9A88C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          </div>
        )}

        <div className="flex-grow flex flex-col justify-center">
          <p className="font-sans text-center font-semibold text-xs uppercase tracking-widest text-[#F9A88C] mb-6">
            {word.theme}
          </p>

          {word.native_script && (
            <h2 className={`text-6xl md:text-7xl font-bold text-center text-gray-900 mb-2 ${getNativeFontClass(word.origin_language)}`}>
              {word.native_script}
            </h2>
          )}
          <h3 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 tracking-tight">
            {word.word}
          </h3>
          
          <div className="text-center mt-8">
              <div className="inline-flex items-center gap-2 group cursor-pointer" onClick={onPronounce}>
                <p className="font-sans text-lg font-semibold text-gray-600 border-b-2 border-gray-300 pb-2 ">
                    Pronunciation
                </p>
                <SpeakerIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-colors" />
              </div>
              <p className="mt-2 text-2xl font-display font-bold text-[#1a1a1a] tracking-wider">
                  {word.pronunciation}
              </p>
          </div>

          <p className="text-center text-lg md:text-xl text-gray-700 mt-8 leading-relaxed font-serif">
            {word.definition}
          </p>
        </div>

        <div className="space-y-3 pt-4 mt-auto border-t border-gray-200/80">
          <div className="font-sans text-center text-xs text-gray-500">
              <p>From the book <strong className="font-semibold text-gray-600">Other-Wordly</strong> by Lex Langford</p>
          </div>
          <div className="font-sans flex justify-between items-center text-sm font-medium text-gray-500">
            <span>{word.origin_country}</span>
            <span>{word.origin_language}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
