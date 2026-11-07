import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  Bell, 
  Menu, 
  ShoppingBag, 
  Globe, 
  ChevronDown, 
  Check, 
  Sparkles,
  MapPin,
  Store,
  Gavel,
  Radio,
  Flame,
  Percent,
  BookOpen,
  Tag
} from 'lucide-react';

interface HeaderProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeCategory,
  onSelectCategory,
  cartCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const categories = [
    { id: 'ana-sehife', label: 'Ana Səhifə', icon: null },
    { id: 'mehsullar', label: 'Məhsullar', icon: null },
    { id: 'hekayeler', label: 'Hekayələr', badge: null },
    { id: 'paylasimlar', label: 'Paylaşımlar', badge: null },
    { id: 'canli-video', label: 'Canlı & Video', badge: 'LIVE', badgeColor: 'bg-rose-500 text-white' },
    { id: 'canli-yayimlar', label: 'Canlı Yayımlar', badge: 'Canlı', badgeColor: 'bg-red-500 text-white' },
    { id: 'resmi-mall', label: 'Rəsmi Mall', badge: 'Orijinal', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'yaxinliqdaki-magazalar', label: 'Yaxınlıqdakı mağazalar', icon: MapPin },
    { id: 'auksion', label: 'Auksion', badge: 'Canlı', badgeColor: 'bg-amber-500 text-white' },
    { id: 'elanlar', label: 'Elanlar', badge: null },
    { id: 'bloq', label: 'Bloq', icon: BookOpen },
    { id: 'kampaniyalar', label: 'Kampaniyalar', badge: 'Hot', badgeColor: 'bg-orange-500 text-white' },
    { id: 'endirimler', label: 'Endirimlər', badge: 'Super', badgeColor: 'bg-violet-600 text-white' },
  ];

  const languages = [
    { code: 'AZ', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'RU', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // handled cleanly
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro bar for announcements */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-200">Panshop Express:</span>
            <span>Bütün 10 ₼ üzəri sifarişlərə pulsuz və sürətli çatdırılma</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200">
            <span className="hover:text-white cursor-pointer transition-colors">Dəstək Mərkəzi 7/24</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer transition-colors">Kuryer ol</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer transition-colors">Mağaza aç</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Wordmark & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 text-white fill-white" 
                stroke="none"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" opacity="0.3"/>
                <path d="M17 8C8 8 7 19 7 19c6 0 10-4 10-11z" fill="white"/>
                <path d="M10 14c2-3 5-4 5-4s-1 4-5 4z" fill="#047857"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-emerald-700 leading-none">
                panshop<span className="text-emerald-500 font-bold">.az</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Milli Bazar & Çatdırılma
              </span>
            </div>
          </a>
        </div>

        {/* Global Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl relative hidden md:block"
        >
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Məhsul, brend, mağaza və ya sifariş kodu axtar..."
              className="w-full pl-11 pr-32 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
            <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
              <button
                type="button"
                aria-label="Səslə axtarış"
                className="p-1.5 hover:text-emerald-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Səslə axtarış"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Şəkillə axtarış"
                className="p-1.5 hover:text-emerald-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Şəkillə axtarış"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Axtar
              </button>
            </div>
          </div>
        </form>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) setUnreadCount(0);
              }}
              aria-label="Bildirişlər"
              className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <span className="font-semibold text-xs text-slate-900">Bildirişlər (1 yeni)</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-emerald-600 hover:underline"
                  >
                    Bağla
                  </button>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">Sifarişiniz təsdiqləndi</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        #d22b7225 kodlu sifarişiniz Elnur660 mağazası tərəfindən qəbul edildi.
                      </p>
                      <span className="text-[10px] text-emerald-700 font-mono mt-1 inline-block">İndi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Dil seçimi"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
            >
              <span>{languages.find((l) => l.code === currentLang)?.flag || '🇦🇿'}</span>
              <span className="font-semibold">{currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-emerald-50 transition-colors ${
                      currentLang === lang.code ? 'font-semibold text-emerald-600' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User profile / store pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
              E
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800">Elnur N.</span>
              <span className="text-[10px] text-slate-500">Müştəri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Navigation Bar */}
      <div className="border-t border-slate-100 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5 min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50/90 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat.icon && <cat.icon className="w-3.5 h-3.5 text-slate-400" />}
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${cat.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
