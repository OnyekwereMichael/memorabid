# Image Handling for Auction Payloads

## Overview

This documentation explains how to handle images in auction payloads, specifically how to take only the first image from an array, convert it to Base64, and include it in the auction payload.

## Implementation

We've created utility functions in `imageUtils.ts` and `auctionUtils.ts` to handle this requirement:

### 1. Image Utilities (`imageUtils.ts`)

- `fileToBase64`: Converts a File object to a Base64 string
- `getFirstImageAsBase64`: Takes only the first image from an array, converts it to Base64, and returns it

### 2. Auction Utilities (`auctionUtils.ts`)

- `createAuctionPayloadWithSingleImage`: Creates an auction payload with only the first image converted to Base64

## Usage

### Basic Usage

```typescript
import { getFirstImageAsBase64 } from '@/lib/imageUtils';

// In your component or function
const handleSubmit = async () => {
  // Assuming 'images' is an array of File objects or Base64 strings
  const firstImageBase64 = await getFirstImageAsBase64(images);
  
  // Create payload with only the first image
  const payload = {
    // other auction data
    media: firstImageBase64 ? [firstImageBase64] : [],
  };
  
  // Send payload to API
};
```

### Using the Auction Utility

```typescript
import { createAuctionPayloadWithSingleImage } from '@/lib/auctionUtils';

// In your component or function
const handleSubmit = async () => {
  // Assuming 'auctionData' contains all auction fields including 'media' array
  const payload = await createAuctionPayloadWithSingleImage(auctionData);
  
  // Send payload to API
};
```

## Implementation in AdminDashboard

The `AdminDashboard.tsx` component has been updated to use the `getFirstImageAsBase64` utility function to create auction payloads with only the first image.

## Example Component

An example component `AuctionPayloadExample.tsx` has been created in the `examples` directory to demonstrate how to use these utilities.

## Notes

- Only the first image from the array is converted to Base64 and included in the payload
- If the array is empty or contains no valid images, an empty array is included in the payload
- The Base64 image is included as a single-item array in the payload