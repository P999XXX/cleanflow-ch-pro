import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { ContactCard } from './ContactCard';

interface VirtualizedContactsCardsProps {
  items: any[];
  type: 'company' | 'person';
  onCardClick: (item: any, type: 'company' | 'person') => void;
  sectionTitle?: string;
}

export function VirtualizedContactsCards({
  items,
  type,
  onCardClick,
  sectionTitle,
}: VirtualizedContactsCardsProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate items per row based on container width
  const itemsPerRow = 3; // For desktop grid-cols-3
  const rows = Math.ceil(items.length / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220, // Estimated row height in pixels
    overscan: 2, // Render 2 extra rows for smoother scrolling
  });

  return (
    <div>
      {sectionTitle && (
        <h2 className="text-xl font-semibold mb-4">{sectionTitle}</h2>
      )}
      
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: '600px', maxHeight: '70vh' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const startIndex = virtualRow.index * itemsPerRow;
            const endIndex = Math.min(startIndex + itemsPerRow, items.length);
            const rowItems = items.slice(startIndex, endIndex);

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                  {rowItems.map((item) => (
                    <ContactCard
                      key={item.id}
                      item={item}
                      type={type}
                      onCardClick={onCardClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Keine Einträge vorhanden
        </div>
      )}
    </div>
  );
}
