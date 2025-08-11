import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom event system for auction updates
export const AUCTION_EVENTS = {
  AUCTION_CREATED: 'auction-created',
  AUCTION_UPDATED: 'auction-updated',
  AUCTION_DELETED: 'auction-deleted',
  BID_PLACED: 'bid-placed'
};

// Helper to emit auction events
export function emitAuctionEvent(eventName: string, data?: any) {
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
}

export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name: string): string | null {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null as string | null);
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function isAuthenticated() {
  return !!getCookie('token');
}

export function formatAuctionTime(utcString) {
  const date = new Date(utcString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


  // Helper to get the auction object from the API response
  const getAuctionObj = (item: any) => item.auction || {};
  
export   // Helper to get time left
  const getTimeLeft = (item: any) => {
    const auction = getAuctionObj(item);
    const now = new Date();
    const end = new Date(auction.auction_end_time);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };