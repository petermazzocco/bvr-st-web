# SEO and Social Sharing Setup Guide

## Overview
This guide details the metadata improvements made to enhance SEO and social sharing across the BVR STR CO website.

## Implementation Summary

### 1. Metadata Utility (`lib/metadata.ts`)
Created a comprehensive metadata utility that provides:
- Uniform metadata generation across all pages
- OpenGraph support for social sharing
- Twitter Card integration
- Product-specific metadata for e-commerce
- Collection and store metadata for partner stores
- Article metadata for blog posts

### 2. Pages Updated with Metadata

#### Root Layout (`app/layout.tsx`)
- Enhanced with comprehensive site-wide metadata
- OpenGraph images and social media tags
- Twitter Card support
- Brand-specific keywords

#### Dynamic Pages with `generateMetadata`:
- **Products** (`app/products/[handle]/page.tsx`): Enhanced with product-specific metadata, pricing info, and availability
- **Collections** (`app/collections/[handle]/page.tsx`): Collection metadata with product counts and descriptions
- **Partner Stores** (`app/stores/[name]/page.tsx`): Store-specific metadata with partner branding
- **Partner Collections** (`app/stores/[name]/collections/[handle]/page.tsx`): Partner collection metadata
- **Partner Products** (`app/stores/[name]/collections/[handle]/products/[product]/page.tsx`): Partner product metadata

#### Static Pages with Metadata:
- **Homepage** (`app/page.tsx`): Hero image and main brand messaging
- **About** (`app/about/page.tsx`): Brand story and mission
- **Contact** (`app/contact/page.tsx`): Contact and partner application info
- **Membership** (`app/membership/page.tsx`): Membership benefits and exclusive access
- **Store Docs** (`app/stores/docs/page.tsx`): Partner documentation

## Required Assets

### OpenGraph Images
You need to create and add these images to the `public` folder:

1. **Default OG Image**: `/public/og-image.jpg` (1200x630px)
   - Should feature the BVR STR CO brand
   - Include tagline: "Premium Streetwear & Independent Fashion"

2. **Hero Image**: `/public/hero.jpg` 
   - Homepage hero background
   - Should be high-quality and represent the brand aesthetic

3. **About Image**: `/public/about.jpg`
   - Brand story visual
   - Behind-the-scenes or brand aesthetic image

### Recommended Image Specifications:
- **OpenGraph**: 1200x630px (1.91:1 ratio)
- **Twitter Card**: 1200x630px (same as OG)
- **Format**: JPG or PNG (JPG preferred for smaller file sizes)
- **File Size**: Keep under 1MB for fast loading

## SEO Features Implemented

### 1. Technical SEO
- Structured data (JSON-LD) for products and collections
- Canonical URLs to prevent duplicate content
- Robots directives for proper indexing
- Meta descriptions optimized for search

### 2. Social Media Optimization
- OpenGraph tags for Facebook, LinkedIn sharing
- Twitter Cards for rich Twitter sharing
- Brand-consistent social media metadata
- Image alt tags for accessibility

### 3. E-commerce SEO
- Product schema with pricing and availability
- Collection organization for better navigation
- Partner store SEO for marketplace approach
- Structured product information

### 4. Performance Considerations
- Metadata is generated server-side for better SEO
- Images should be optimized for web
- Canonical URLs prevent duplicate content issues

## Next Steps

### 1. Create Required Images
- Design the OpenGraph image template
- Create product-specific OG images for top products
- Collection images for social sharing

### 2. Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://bvrstrco.com
```

### 3. Social Media Accounts
- Set up Twitter account: @bvrstrco
- Verify social media handles in metadata

### 4. Testing
Use these tools to test metadata:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Google Rich Results Test: https://search.google.com/test/rich-results

### 5. Analytics Setup
- Implement Google Analytics 4
- Set up Google Search Console
- Monitor social sharing performance

## Maintenance

### Regular Updates
- Update product metadata when adding new items
- Refresh collection descriptions seasonally
- Update OpenGraph images for campaigns
- Monitor and update meta descriptions based on performance

### Performance Monitoring
- Track search rankings for target keywords
- Monitor social sharing engagement
- Update metadata based on analytics insights
- A/B test different descriptions and titles

This comprehensive metadata setup provides a strong foundation for SEO and social media marketing while maintaining consistent branding across all touchpoints.