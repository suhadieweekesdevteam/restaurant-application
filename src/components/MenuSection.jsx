import React, { useState, useMemo } from 'react';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Plus, 
  Minus, 
  Star, 
  Info, 
  Check, 
  UtensilsCrossed, 
  X, 
  Soup, 
  CookingPot, 
  Wheat, 
  GlassWater, 
  Cake 
} from 'lucide-react';

export const MenuSection = () => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { soldOutItems, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [selectedPortions, setSelectedPortions] = useState({});
  const [inspectItem, setInspectItem] = useState(null);

  // Icon mapper
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Soup': return <Soup className="w-4 h-4" />;
      case 'CookingPot': return <CookingPot className="w-4 h-4" />;
      case 'Wheat': return <Wheat className="w-4 h-4" />;
      case 'GlassWater': return <GlassWater className="w-4 h-4" />;
      case 'Cake': return <Cake className="w-4 h-4" />;
      default: return <UtensilsCrossed className="w-4 h-4" />;
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Diet match
      if (dietFilter === 'veg' && !item.veg) return false;
      if (dietFilter === 'non-veg' && item.veg) return false;
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [selectedCategory, dietFilter, searchQuery]);

  const handlePortionChange = (itemId, portion) => {
    setSelectedPortions(prev => ({
      ...prev,
      [itemId]: portion
    }));
  };

  const getEffectivePortion = (item) => {
    if (item.portions && item.portions.length > 0) {
      return selectedPortions[item.id] || item.portions[0];
    }
    return null;
  };

  const getItemCartQuantity = (item) => {
    const portion = getEffectivePortion(item);
    const cartItemId = portion ? `${item.id}-${portion.size}` : `${item.id}-Standard`;
    const cartEntry = cart.find(c => c.cartItemId === cartItemId);
    return cartEntry ? cartEntry.quantity : 0;
  };

  const handleAddToCart = (item) => {
    const isSoldOut = soldOutItems.includes(item.id);
    if (isSoldOut) {
      showToast(`${item.name} is currently sold out. Please choose another delicacy!`, 'warning');
      return;
    }
    const portion = getEffectivePortion(item);
    addToCart(item, portion);
    showToast(`Added ${item.name} ${portion ? `(${portion.size})` : ''} to Dawat cart!`);
  };

  return (
    <section id="menu" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>The Grand Royal Dawat</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Curated <span className="gold-gradient-text">Culinary Treasures</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Every dish is handcrafted using heirloom Mughlai spices, wood-fire charcoal embers, and the timeless art of underground pit steam.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 border border-amber-500/20 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search Mandi, Galouti, Nawabi Murgh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-stone-900/80 border border-stone-800 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Diet Filter Switch (All / Veg / Non-Veg) */}
            <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-stone-800 w-full md:w-auto justify-center">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  dietFilter === 'all' 
                    ? 'bg-amber-500 text-stone-950 shadow-md' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                All Delicacies
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  dietFilter === 'veg' 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-stone-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setDietFilter('non-veg')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  dietFilter === 'non-veg' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'text-stone-400 hover:text-red-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>Non-Veg (Halal)</span>
              </button>
            </div>

          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/20 font-bold' 
                      : 'bg-stone-900/60 text-stone-300 hover:bg-stone-800 hover:text-amber-300 border border-stone-800'
                  }`}
                >
                  <span className={isSelected ? 'text-stone-950' : 'text-amber-400'}>
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto border border-stone-800 space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-200">No Delicacies Found</h3>
            <p className="text-xs text-stone-400">Try adjusting your search query or dietary filter to explore other royal creations.</p>
            <button
              onClick={() => { setSearchQuery(''); setDietFilter('all'); setSelectedCategory('all'); }}
              className="text-xs px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg hover:bg-amber-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const isSoldOut = soldOutItems.includes(item.id);
              const portion = getEffectivePortion(item);
              const currentPrice = portion ? portion.price : item.price;
              const cartQty = getItemCartQuantity(item);

              return (
                <div
                  key={item.id}
                  className={`group glass-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl flex flex-col justify-between ${
                    isSoldOut 
                      ? 'opacity-60 border-stone-800' 
                      : 'border-stone-800/80 hover:border-amber-500/40 hover:-translate-y-1'
                  }`}
                >
                  {/* Top Image Box */}
                  <div className="relative h-52 overflow-hidden bg-stone-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

                    {/* Veg/Non-Veg & Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div 
                        className={`w-5 h-5 rounded flex items-center justify-center bg-stone-950/80 backdrop-blur-md border ${
                          item.veg ? 'border-emerald-500' : 'border-red-500'
                        }`}
                        title={item.veg ? 'Pure Vegetarian' : 'Non-Vegetarian (Halal)'}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${item.veg ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      </div>

                      {item.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/90 text-stone-950 shadow-md">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick Info Modal Trigger */}
                    <button
                      onClick={() => setInspectItem(item)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-950/70 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-white/10 transition-colors"
                      title="View Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Spice & Rating Bar on Image Bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
                      <div className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-white">{item.rating}</span>
                        <span className="text-[10px] text-stone-400">({item.reviews})</span>
                      </div>

                      {item.spiceLevel !== 'None' && item.spiceLevel !== 'Sweet' && (
                        <span className="bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-stone-800 text-[11px] text-amber-400 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span>{item.spiceLevel}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-light">
                        {item.description}
                      </p>

                      {/* Tag Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Portions Selector (for Mandi Platters) */}
                    {item.portions && item.portions.length > 0 && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                          Select Platter Size:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {item.portions.map(p => {
                            const isChosen = portion?.size === p.size;
                            return (
                              <button
                                key={p.size}
                                onClick={() => handlePortionChange(item.id, p)}
                                className={`p-1.5 rounded-lg text-left border text-[11px] transition-all ${
                                  isChosen 
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' 
                                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                                }`}
                              >
                                <div className="truncate font-semibold">{p.size.split(' ')[0]}</div>
                                <div className="text-[10px] text-stone-400">₹{p.price}</div>
                              </button>
                            );
                          })}
                        </div>
                        {portion && (
                          <div className="text-[10px] text-amber-400/80 mt-1 flex justify-between">
                            <span>Serves: {portion.serves}</span>
                            <span>Portion: {portion.weight}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Pricing & Add to Cart */}
                    <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Price</span>
                        <div className="text-xl font-extrabold text-amber-400 font-cinzel">
                          ₹{currentPrice}
                        </div>
                      </div>

                      {isSoldOut ? (
                        <span className="text-xs px-3 py-1.5 bg-stone-800 text-stone-400 font-medium rounded-lg">
                          Sold Out Today
                        </span>
                      ) : cartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-amber-500 text-stone-950 font-bold px-2 py-1 rounded-xl shadow-md">
                          <button
                            onClick={() => updateQuantity(portion ? `${item.id}-${portion.size}` : `${item.id}-Standard`, -1)}
                            className="p-1 hover:bg-amber-600 rounded"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm px-1.5">{cartQty}</span>
                          <button
                            onClick={() => updateQuantity(portion ? `${item.id}-${portion.size}` : `${item.id}-Standard`, 1)}
                            className="p-1 hover:bg-amber-600 rounded"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Dawat</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Inspect Item Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel border border-amber-500/40 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative bg-[#0c0f18] my-auto">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute top-3.5 right-3.5 z-10 p-1.5 sm:p-2 rounded-full bg-stone-950/80 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-44 sm:h-52 shrink-0 relative">
              <img
                src={inspectItem.image}
                alt={inspectItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f18] via-stone-950/40 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 sm:left-5 sm:right-5">
                <span className="text-[11px] uppercase text-amber-400 font-bold tracking-wider">{inspectItem.category}</span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">{inspectItem.name}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{inspectItem.description}</p>
              
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-stone-800 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Spice Level</span>
                  <span className="font-semibold text-amber-400">{inspectItem.spiceLevel}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Dine-in Pairing</span>
                  <span className="font-semibold text-stone-200">Pair with Mohabbat Sharbat</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xl sm:text-2xl font-cinzel font-black text-amber-400">
                  ₹{inspectItem.price}
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(inspectItem);
                    setInspectItem(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
