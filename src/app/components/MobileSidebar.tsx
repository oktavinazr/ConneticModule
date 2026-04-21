import { Link } from 'react-router';
import { Menu, BookOpen } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface MobileSidebarItem {
  label: string;
  href?: string;
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface MobileSidebarProps {
  title: string;
  description: string;
  items: MobileSidebarItem[];
}

export function MobileSidebar({ title, description, items }: MobileSidebarProps) {
  const regularItems = items.filter((item) => !item.danger);
  const dangerItems = items.filter((item) => item.danger);

  const renderItemContent = (item: MobileSidebarItem) => (
    <>
      {item.icon && (
        <span
          className={
            item.danger
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500'
              : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#628ECB]/10 text-[#628ECB]'
          }
        >
          {item.icon}
        </span>
      )}
      <span className="text-sm font-semibold">{item.label}</span>
    </>
  );

  const getItemClass = (item: MobileSidebarItem) =>
    item.danger
      ? 'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-red-500 transition-colors hover:bg-red-50 active:bg-red-100'
      : 'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[#395886] transition-colors hover:bg-[#F0F3FA] active:bg-[#E8EEF8]';

  const renderItem = (item: MobileSidebarItem) => {
    if (item.to) {
      return (
        <SheetClose asChild key={item.label}>
          <Link to={item.to} className={getItemClass(item)}>
            {renderItemContent(item)}
          </Link>
        </SheetClose>
      );
    }
    if (item.href) {
      return (
        <SheetClose asChild key={item.label}>
          <a href={item.href} className={getItemClass(item)}>
            {renderItemContent(item)}
          </a>
        </SheetClose>
      );
    }
    return (
      <SheetClose asChild key={item.label}>
        <button type="button" onClick={item.onClick} className={getItemClass(item)}>
          {renderItemContent(item)}
        </button>
      </SheetClose>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#628ECB] text-white shadow-md transition-colors hover:bg-[#395886] md:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-[#D5DEEF] bg-white p-0">
        {/* Kepala */}
        <SheetHeader className="p-0">
          <div className="bg-gradient-to-br from-[#395886] to-[#628ECB] px-6 py-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shadow-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold leading-tight text-white">
                  CONNETIC
                </SheetTitle>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Module
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-white/80">{description}</p>
          </div>
        </SheetHeader>

        {/* Item Navigasi */}
        <div className="flex flex-col p-3 pt-4">
          <p className="mb-1 px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#395886]/40">
            {title}
          </p>

          {regularItems.map(renderItem)}

          {dangerItems.length > 0 && (
            <>
              <div className="my-3 border-t border-[#D5DEEF]" />
              {dangerItems.map(renderItem)}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
