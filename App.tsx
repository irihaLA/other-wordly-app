
import React, { useState, useCallback, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { UntranslatableWord, AppStatus, ImageGenStatus, View, FavoriteWord } from './types';
import { findWordForFeeling, generateImageForDefinition } from './services/geminiService';
import { WORDS_LIST } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { speakWord } from './utils/speech';

import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultCard } from './components/ResultCard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { FavoritesGallery } from './components/FavoritesGallery';
import { SparklesIcon, DownloadIcon, ShareIcon, ImageIcon } from './components/Icons';
import * as htmlToImage from 'html-to-image';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [feeling, setFeeling] = useState<string>('');
  const [result, setResult] = useState<UntranslatableWord | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [imageGenStatus, setImageGenStatus] = useState<ImageGenStatus>(ImageGenStatus.IDLE);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [view, setView] = useState<View>(View.SEARCH);

  const [favorites, setFavorites] = useLocalStorage<FavoriteWord[]>('other-wordly-favorites', []);

  const resultCardRef = useRef<HTMLDivElement>(null);
  const canShare = navigator.share !== undefined;

  const resetState = useCallback((keepFeeling = false) => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
    setBackgroundImage(null);
    setImageGenStatus(ImageGenStatus.IDLE);
    if (!keepFeeling) {
      setFeeling('');
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feeling.trim()) return;

    resetState(true);
    setStatus(AppStatus.LOADING);

    try {
      const foundWord = await findWordForFeeling(feeling);
      setResult(foundWord);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(AppStatus.ERROR);
    }
  }, [feeling, resetState]);

  const handleSurpriseMe = useCallback(() => {
    resetState();
    setStatus(AppStatus.LOADING);
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * WORDS_LIST.length);
        const randomWord = WORDS_LIST[randomIndex];
        setResult(randomWord);
        setStatus(AppStatus.SUCCESS);
    }, 700); // Simulate a short loading for better UX
  }, [resetState]);


  const handleGenerateImage = useCallback(async () => {
    if (!result) return;
    
    setImageGenStatus(ImageGenStatus.LOADING);
    setError(null);

    try {
      const imageUrl = await generateImageForDefinition(result.definition, result.theme);
      setBackgroundImage(imageUrl);
      setImageGenStatus(ImageGenStatus.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setImageGenStatus(ImageGenStatus.ERROR);
    }
  }, [result]);

  const handleDownload = useCallback(() => {
    if (resultCardRef.current === null) return;

    htmlToImage.toPng(resultCardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#FDFBF8' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${result?.word?.toLowerCase().replace(/ /g, '_') || 'other-wordly'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Download failed!', err);
        setError("Could not generate image for download. Please try again.");
      });
  }, [result]);

  const handleShare = useCallback(async () => {
    if (!resultCardRef.current || !result || !navigator.share) return;
    
    setIsSharing(true);
    setError(null);
    try {
      const blob = await htmlToImage.toBlob(resultCardRef.current, { pixelRatio: 2, backgroundColor: '#FDFBF8' });
      if (!blob) throw new Error("Could not create image blob.");

      const file = new File([blob], `${result.word.toLowerCase().replace(/ /g, '_')}.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `I found my feeling: ${result.word}`,
          text: `"${result.definition}" Find your word with Other-Wordly.`,
        });
      } else {
        throw new Error("Sharing files is not supported on this device.");
      }
    } catch (err) {
      console.error('Sharing failed', err);
      if (!(err instanceof Error && err.name === 'AbortError')) {
        setError("Sharing failed or is not supported on this device.");
      }
    } finally {
      setIsSharing(false);
    }
  }, [result]);

  const handleToggleFavorite = useCallback(() => {
    if (!result) return;
    
    const isAlreadyFavorite = favorites.some(fav => fav.word === result.word);
    
    if (isAlreadyFavorite) {
        setFavorites(prev => prev.filter(fav => fav.word !== result.word));
    } else {
        // When adding, if a background image exists, save it.
        const newFavorite: FavoriteWord = { ...result, backgroundImage };
        setFavorites(prev => [...prev, newFavorite]);
    }
  }, [result, backgroundImage, favorites, setFavorites]);

  const isCurrentResultFavorite = useMemo(() => {
    if (!result) return false;
    return favorites.some(fav => fav.word === result.word);
  }, [result, favorites]);

  const handlePronounce = useCallback(() => {
    if (!result) return;
    speakWord(result.word, result.origin_language);
  }, [result]);

  const handleSelectFavorite = useCallback((favorite: FavoriteWord) => {
    setStatus(AppStatus.SUCCESS);
    setResult(favorite);
    setBackgroundImage(favorite.backgroundImage || null);
    setImageGenStatus(favorite.backgroundImage ? ImageGenStatus.SUCCESS : ImageGenStatus.IDLE);
    setView(View.SEARCH);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderSearchContent = () => {
    switch (status) {
      case AppStatus.LOADING:
        return <Loader />;
      case AppStatus.SUCCESS:
        return result && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              {result.reasoning && <p className="mt-8 mb-4 text-center text-gray-700 italic max-w-xl">{result.reasoning}</p>}
              {imageGenStatus === ImageGenStatus.ERROR && <ErrorDisplay message={error} />}
              <ResultCard
                ref={resultCardRef}
                word={result}
                backgroundImage={backgroundImage}
                isGeneratingImage={imageGenStatus === ImageGenStatus.LOADING}
                isFavorite={isCurrentResultFavorite}
                onToggleFavorite={handleToggleFavorite}
                onPronounce={handlePronounce}
              />
              <div className="flex items-center gap-4 mt-6 flex-wrap justify-center">
                 <button onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3 bg-[#F9A88C] text-white font-bold rounded-lg shadow-md hover:bg-[#f89a77] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F9A88C] focus:ring-offset-2 focus:ring-offset-[#FDFBF8]"> <DownloadIcon /> Download </button>
                 {canShare && ( <button onClick={handleShare} disabled={isSharing} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:ring-offset-[#FDFBF8] disabled:bg-gray-400"> {isSharing ? 'Sharing...' : <ShareIcon />} {isSharing ? '' : 'Share'} </button> )}
                 {imageGenStatus !== ImageGenStatus.SUCCESS && ( <button onClick={handleGenerateImage} disabled={imageGenStatus === ImageGenStatus.LOADING} className="inline-flex items-center gap-2 px-6 py-3 bg-[#88a5f9] text-white font-bold rounded-lg shadow-md hover:bg-[#7794e8] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#88a5f9] focus:ring-offset-2 focus:ring-offset-[#FDFBF8] disabled:bg-gray-400"> {imageGenStatus === ImageGenStatus.LOADING ? ( <> <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Generating... </> ) : ( <> <ImageIcon /> Add Artistic Background </> )} </button> )}
              </div>
            </div>
        );
      case AppStatus.ERROR:
        return <ErrorDisplay message={error} />;
      case AppStatus.IDLE:
      default:
        return (
          <div className="text-center mt-12 text-gray-500">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg">Describe a feeling, a moment, or a thought.</p>
            <p>Find the word you've been searching for.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-gray-900 flex flex-col items-center p-4 sm:p-8 transition-colors duration-500">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <Header view={view} setView={setView} favoriteCount={favorites.length} />
        
        <div className={clsx("w-full transition-all duration-300", view === View.SEARCH ? "opacity-100 visible" : "opacity-0 invisible h-0")}>
          <SearchForm
            feeling={feeling}
            setFeeling={setFeeling}
            handleSubmit={handleSubmit}
            isLoading={status === AppStatus.LOADING}
            onSurpriseMe={handleSurpriseMe}
          />
        </div>

        <div className={clsx("w-full mt-4", view === View.SEARCH ? "block" : "hidden")}>
          {renderSearchContent()}
        </div>

        {view === View.FAVORITES && (
            <FavoritesGallery favorites={favorites} onSelectFavorite={handleSelectFavorite} />
        )}
      </main>
    </div>
  );
};

export default App;
