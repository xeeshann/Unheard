import { useState, useEffect, useCallback, useMemo } from "react";
import { Pagination } from "@nextui-org/pagination";
import { Confession, Tag, ReactionType } from "@/types/confession";
import { ConfessionCard, ReactionContext } from "./ConfessionCard";

interface ConfessionFeedProps {
  confessions: Confession[];
  activeFilter: Tag | null;
  selectedCategory: string;
  searchQuery: string;
  onTagSelect: (tag: Tag | null) => void;
  onToggleReaction: (confessionId: string, reactionType: ReactionType) => void;
  onAddComment: (confessionId: string, text: string, username?: string, avatar?: string) => void;
}

export const ConfessionFeed = ({
  confessions,
  activeFilter,
  selectedCategory,
  searchQuery,
  onTagSelect,
  onToggleReaction,
  onAddComment
}: ConfessionFeedProps) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = isMobile ? 6 : 9; // Fewer items per page on mobile
  
  // State for tracking active reaction card
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Throttled resize listener
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout === null) {
        resizeTimeout = window.setTimeout(() => {
          resizeTimeout = null;
          checkScreenSize();
        }, 200);
      }
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
    };
  }, []);

  // Use memoization to prevent unnecessary filtering on each render
  const getFilteredConfessions = useCallback(() => {
    let filtered = [...confessions];
    
    // Filter by tag if activeFilter is set
    if (activeFilter) {
      filtered = filtered.filter(c => c.tags.includes(activeFilter));
    }
    
    // Filter by search query if it exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.text.toLowerCase().includes(query) || 
        c.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (c.username && c.username.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    switch (selectedCategory) {
      case "recent":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "highlighted":
        // Put highlighted posts first, then sort by recency
        filtered.sort((a, b) => {
          if (a.isHighlighted && !b.isHighlighted) return -1;
          if (!a.isHighlighted && b.isHighlighted) return 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        break;
      default:
        // Default to recency if no category matches
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    return filtered;
  }, [confessions, activeFilter, searchQuery, selectedCategory]);

  // Memoize the filtered confessions to avoid recalculation on every render
  const filteredConfessions = useMemo(() => getFilteredConfessions(), 
    [getFilteredConfessions]);
  
  // Get the current page of confessions
  const getCurrentConfessions = useCallback(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredConfessions.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredConfessions, currentPage, itemsPerPage]);

  // Memoize the current page of confessions
  const currentConfessions = useMemo(() => getCurrentConfessions(), 
    [getCurrentConfessions]);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredConfessions.length / itemsPerPage)), 
    [filteredConfessions, itemsPerPage]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, selectedCategory, searchQuery]);
  
  // Reset active card when pagination changes
  useEffect(() => {
    setActiveCardId(null);
  }, [currentPage]);

  // Handle window visibility changes to improve performance when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is not visible, clean up any expensive animations
        setActiveCardId(null);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <ReactionContext.Provider value={{ activeCardId, setActiveCardId }}>
      {filteredConfessions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentConfessions.map(confession => (
              <ConfessionCard
                key={confession.id}
                confession={confession}
                onToggleReaction={onToggleReaction}
                onAddComment={onAddComment}
                onTagSelect={onTagSelect}
              />
            ))}
          </div>
          
          {/* Pagination Controls - optimized for touch */}
          {totalPages > 1 && (
            <div className="flex justify-center my-6">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
              color="secondary"
              className="pagination custom-pagination"
              size="lg"                  
              />
              
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No confessions found</h3>
          <p className="text-zinc-500 max-w-md px-4">
            {searchQuery 
              ? `We couldn't find any confessions matching "${searchQuery}"`
              : activeFilter
                ? `We couldn't find any confessions with the tag ${activeFilter}`
                : "There are no confessions yet. Be the first to share!"
            }
          </p>
          
        </div>
      )}
    </ReactionContext.Provider>
  );
};