
import React from 'react';
import { FavoriteWord } from '../types';
import { BookOpenIcon } from './Icons';

interface FavoriteCardProps {
    word: FavoriteWord;
    onSelect: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ word, onSelect }) => {
    const cardStyle = word.backgroundImage ? { 
        backgroundImage: `url(${word.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    } : {};

    const getNativeFontClass = (language: string) => {
        switch(language.toLowerCase()) {
          case 'japanese': return 'font-noto-jp';
          case 'arabic': return 'font-noto-arabic';
          default: return 'font-serif';
        }
      };

    return (
        <button
            type="button"
            onClick={onSelect}
            style={cardStyle}
            className="w-full bg-[#FDFBF8] border border-gray-200/80 shadow-md rounded-lg flex flex-col justify-between aspect-[4/5] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9A88C]"
        >
            <div className="relative w-full h-full p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white">
                {word.native_script && (
                    <h3 className={`text-4xl text-center mb-2 ${getNativeFontClass(word.origin_language)}`}>
                        {word.native_script}
                    </h3>
                )}
                <h2 className="font-display text-2xl font-bold text-center">{word.word}</h2>
                <p className="text-center text-xs uppercase tracking-wider opacity-80 mt-2">{word.theme}</p>
            </div>
        </button>
    );
};


interface FavoritesGalleryProps {
  favorites: FavoriteWord[];
  onSelectFavorite: (word: FavoriteWord) => void;
}

export const FavoritesGallery: React.FC<FavoritesGalleryProps> = ({ favorites, onSelectFavorite }) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center mt-12 text-gray-500 animate-fade-in">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-2xl font-display font-bold">Your collection is empty.</h3>
        <p className="mt-2 max-w-md mx-auto">Click the heart icon on a word card to save it here for later.</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
        <h2 className="text-3xl font-display font-bold text-center mb-8">My Favorite Words</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map(word => (
              <FavoriteCard key={word.word} word={word} onSelect={() => onSelectFavorite(word)} />
            ))}
        </div>
    </div>
  );
};
