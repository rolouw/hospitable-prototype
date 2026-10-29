export type Platform = 'airbnb' | 'booking'

/** `background` is a CSS background value for the photo */
export type Photo = { id: string; label: string; background: string }

export type Listing = {
  platform: Platform
  title: string
  description: string
  cleaningFee: { amount: number; currency: 'EUR' }
  photos: Photo[] // first = cover
  propertyType: 'Entire home'
  minStay: '1 night'
  guests: number
  bedrooms: number
  bathrooms: number
  address: 'Zagore, Croatia'
}

const img = (file: string) => `url(${import.meta.env.BASE_URL}photos/${file}.jpg) center / cover no-repeat`

export const PHOTOS: Record<string, Photo> = {
  p1: { id: 'p1', label: 'House exterior', background: img('exterior') },
  p2: { id: 'p2', label: 'Sea view', background: img('sea-view') },
  p3: { id: 'p3', label: 'Terrace', background: img('terrace') },
  p4: { id: 'p4', label: 'Living room', background: img('living-room') },
  p5: { id: 'p5', label: 'Main bedroom', background: img('main-bedroom') },
  p6: { id: 'p6', label: 'Outdoor kitchen', background: img('outdoor-kitchen') },
  p7: { id: 'p7', label: 'Kitchen', background: img('kitchen') },
  p8: { id: 'p8', label: 'Second bedroom', background: img('second-bedroom') },
  p9: { id: 'p9', label: 'Bathroom', background: img('bathroom') },
}

export const PLATFORM_NAME: Record<Platform, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
}

/** Where the property is, for copy that names the location */
export const LOCATION = 'Zagore'

/** What Hospitable calls the merged property when Booking.com leads */
export const BOOKING_PROPERTY_NAME = 'Zagore Stone House'

/** Short name used in headers while reviewing */
export const PROPERTY_SHORT_NAME = 'Stone house in Zagore'

/** Fewest photos a host can pick for both listings */
export const MIN_PHOTOS = 5

export const AIRBNB_TITLE_LIMIT = 50
export const AIRBNB_DESCRIPTION_LIMIT = 500

const airbnb: Listing = {
  platform: 'airbnb',
  title: 'Stone House by the Sea',
  description:
    'Enjoy sea views from this traditional stone house. Walk to the beach, the village and the local konoba.',
  cleaningFee: { amount: 35, currency: 'EUR' },
  photos: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].map((id) => PHOTOS[id]),
  propertyType: 'Entire home',
  minStay: '1 night',
  guests: 4,
  bedrooms: 2,
  bathrooms: 2,
  address: 'Zagore, Croatia',
}

// 5 photos shared with Airbnb plus 2 of its own, with its own cover
const booking: Listing = {
  platform: 'booking',
  title: 'Zagore Stone House - Two-Bedroom House with Sea View',
  description:
    'Bright two-bedroom stone house in Zagore, five minutes from the beach. Shaded terrace, outdoor kitchen and fast Wi-Fi.',
  cleaningFee: { amount: 30, currency: 'EUR' },
  photos: ['p2', 'p1', 'p3', 'p4', 'p5', 'p8', 'p9'].map((id) => PHOTOS[id]),
  propertyType: 'Entire home',
  minStay: '1 night',
  guests: 4,
  bedrooms: 2,
  bathrooms: 2,
  address: 'Zagore, Croatia',
}

export type Variant = 'full' | 'single'

/**
 * Listings for a variant. In the single-conflict variant only the title differs,
 * so Booking.com mirrors Airbnb for every other field.
 */
export function getListings(variant: Variant): Record<Platform, Listing> {
  if (variant === 'single') {
    return { airbnb, booking: { ...airbnb, platform: 'booking', title: booking.title } }
  }
  return { airbnb, booking }
}

export type FieldKey = 'title' | 'description' | 'cleaningFee' | 'photos'

export const FIELD_LABEL: Record<FieldKey, string> = {
  title: 'Title',
  description: 'Description',
  cleaningFee: 'Cleaning fee',
  photos: 'Photos',
}

export const FIELD_SLUG: Record<FieldKey, string> = {
  title: 'title',
  description: 'description',
  cleaningFee: 'fee',
  photos: 'photos',
}

export const VARIANT_CONFIG: Record<Variant, { fields: FieldKey[]; matching: number }> = {
  full: { fields: ['title', 'description', 'cleaningFee', 'photos'], matching: 11 },
  single: { fields: ['title'], matching: 14 },
}

/** The fields that already match on both listings. Shown read-only on the preview. */
export const MATCHING_FIELDS: { label: string; value: string }[] = [
  { label: 'Property type', value: 'Entire home' },
  { label: 'Address', value: 'Zagore, Croatia' },
  { label: 'Guests', value: '4' },
  { label: 'Bedrooms', value: '2' },
  { label: 'Beds', value: '2 double beds' },
  { label: 'Bathrooms', value: '2' },
  { label: 'Minimum stay', value: '1 night' },
  { label: 'Check-in', value: 'From 15:00' },
  { label: 'Check-out', value: 'By 11:00' },
  { label: 'House rules', value: 'No smoking, no parties' },
  { label: 'Amenities', value: 'Wi-Fi, outdoor kitchen, terrace, air conditioning' },
]
