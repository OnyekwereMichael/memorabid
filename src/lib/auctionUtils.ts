import { getFirstImageAsBase64 } from './imageUtils';
import { CreateAuctionData } from './api';

/**
 * Creates an auction payload with only the first image converted to Base64
 * @param auctionData - The auction data including an array of images
 * @returns A Promise that resolves to the auction payload with only the first image
 */
export const createAuctionPayloadWithSingleImage = async (auctionData: CreateAuctionData): Promise<any> => {
  const {
    auction_start_time,
    auction_end_time,
    bid_increment,
    starting_bid,
    reserve_price,
    promotional_tags,
    media,
    ...rest
  } = auctionData;

  // Convert only the first image to Base64
  const singleImageBase64 = await getFirstImageAsBase64(Array.isArray(media) ? media : []);
  
  // Clean promotional_tags (remove empty tags)
  const cleanedTags = Array.isArray(promotional_tags)
    ? promotional_tags.filter(tag => tag && tag.trim() !== "")
    : [];

  // Build the final payload
  return {
    ...rest,
    auction_start_time,
    auction_end_time,
    starting_bid: Number(starting_bid),
    reserve_price: Number(reserve_price),
    bid_increment: Number(bid_increment),
    media: singleImageBase64 ? [singleImageBase64] : [], // Include only the first image as an array with one item
    promotional_tags: cleanedTags,
  };
};