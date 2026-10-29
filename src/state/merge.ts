import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  BOOKING_PROPERTY_NAME,
  FieldKey,
  Listing,
  PHOTOS,
  PLATFORM_NAME,
  Photo,
  Platform,
  VARIANT_CONFIG,
  Variant,
  getListings,
} from '../data/listings'

export type FieldChoice = 'airbnb' | 'booking' | 'mix' | 'keep' | null
export type FeeChoice = 'airbnb' | 'booking' | 'keep' | null
export type Lead = 'airbnb' | 'booking' | 'fields'
/** Where the host started the merge flow, so leaving it returns them there */
export type Entry = '/properties' | '/setup'

type Fields = {
  title: { choice: FieldChoice; custom: string }
  description: { choice: FieldChoice; custom: string }
  cleaningFee: { choice: FeeChoice }
  /** With choice 'mix', both channels show exactly the photos in `selected`, in the order picked. First is the cover. */
  photos: { choice: FieldChoice; selected: string[] }
}

type MergeData = {
  sidebarCollapsed: boolean
  matched: boolean | null
  lead: Lead
  fields: Fields
  /** Steps the host has opened. A step only shows as done once seen, so the default on Description does not tick it off unseen. */
  visited: FieldKey[]
  published: boolean
  variant: Variant
  entry: Entry
}

type MergeActions = {
  toggleSidebar: () => void
  setMatched: (matched: boolean) => void
  setLead: (lead: Lead) => void
  setChoice: (field: FieldKey, choice: Exclude<FieldChoice, null>) => void
  setCustom: (field: 'title' | 'description', custom: string) => void
  setSelectedPhotos: (selected: string[]) => void
  markVisited: (field: FieldKey) => void
  publish: () => void
  setVariant: (variant: Variant) => void
  setEntry: (entry: Entry) => void
  reset: () => void
}

export type MergeState = MergeData & MergeActions

const initial: MergeData = {
  sidebarCollapsed: false,
  matched: null,
  lead: 'airbnb',
  fields: {
    title: { choice: null, custom: '' },
    description: { choice: 'keep', custom: '' },
    cleaningFee: { choice: null },
    photos: { choice: null, selected: [] },
  },
  visited: [],
  published: false,
  variant: 'full',
  entry: '/properties',
}

export const useMerge = create<MergeState>()(
  persist(
    (set) => ({
      ...initial,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMatched: (matched) => set({ matched }),
      setLead: (lead) => set({ lead }),
      setChoice: (field, choice) =>
        set((s) => ({ fields: { ...s.fields, [field]: { ...s.fields[field], choice } } })),
      setCustom: (field, custom) =>
        set((s) => ({ fields: { ...s.fields, [field]: { ...s.fields[field], custom } } })),
      setSelectedPhotos: (selected) =>
        set((s) => ({ fields: { ...s.fields, photos: { ...s.fields.photos, selected } } })),
      markVisited: (field) =>
        set((s) => (s.visited.includes(field) ? s : { visited: [...s.visited, field] })),
      publish: () => set({ published: true }),
      setVariant: (variant) => set({ variant }),
      setEntry: (entry) => set({ entry }),
      reset: () => set((s) => ({ ...initial, sidebarCollapsed: s.sidebarCollapsed })),
    }),
    {
      name: 'hospitable-option-8',
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
      // Sessions saved before photo picking existed start over
      migrate: () => initial as unknown as MergeState,
    },
  ),
)

/* ---------- Derivations ---------- */

export type Resolved = Record<FieldKey, Exclude<FieldChoice, null>>

export const SUGGESTED = {
  title: 'Stone house with sea view in Zagore',
  description:
    'Bright two-bedroom stone house in Zagore with sea views, a short walk to the beach and the village. Shaded terrace, outdoor kitchen and fast Wi-Fi.',
}

export function isFieldReady(fields: Fields, field: FieldKey): boolean {
  const f = fields[field]
  if (f.choice === null) return false
  if (f.choice === 'mix' && 'custom' in f) return f.custom.trim().length > 0
  if (f.choice === 'mix' && 'selected' in f) return f.selected.length > 0
  return true
}

export function isStepDone(s: Pick<MergeData, 'fields' | 'visited'>, field: FieldKey): boolean {
  return s.visited.includes(field) && isFieldReady(s.fields, field)
}

/** The choice that applies per field. Unset or incomplete choices fall back to keep. */
export function resolveChoices(s: Pick<MergeData, 'lead' | 'fields'>): Resolved {
  if (s.lead !== 'fields') {
    return { title: s.lead, description: s.lead, photos: s.lead, cleaningFee: 'keep' }
  }
  const pick = (field: FieldKey) => (isFieldReady(s.fields, field) ? s.fields[field].choice! : 'keep')
  return {
    title: pick('title'),
    description: pick('description'),
    cleaningFee: pick('cleaningFee'),
    photos: pick('photos'),
  }
}

export function selectedPhotos(fields: Fields): Photo[] {
  return fields.photos.selected.map((id) => PHOTOS[id]).filter(Boolean)
}

/** Union of both sets with one channel's photos first, so that channel keeps its own cover */
export function unionPhotos(first: Photo[], second: Photo[]): Photo[] {
  const ids = new Set(first.map((p) => p.id))
  return [...first, ...second.filter((p) => !ids.has(p.id))]
}

export type ChannelValues = {
  title: string
  description: string
  cleaningFee: number
  photos: Photo[]
}

export function channelValues(
  platform: Platform,
  choices: Resolved,
  fields: Fields,
  listings: Record<Platform, Listing>,
): ChannelValues {
  const own = listings[platform]
  const text = (field: 'title' | 'description') => {
    const c = choices[field]
    if (c === 'airbnb' || c === 'booking') return listings[c][field]
    if (c === 'mix') return fields[field].custom.trim()
    return own[field]
  }
  const fee = choices.cleaningFee
  const photos = choices.photos
  return {
    title: text('title'),
    description: text('description'),
    cleaningFee: fee === 'airbnb' || fee === 'booking' ? listings[fee].cleaningFee.amount : own.cleaningFee.amount,
    photos:
      photos === 'airbnb' || photos === 'booking'
        ? listings[photos].photos
        : photos === 'mix'
          ? selectedPhotos(fields)
          : own.photos,
  }
}

export function directValues(choices: Resolved, fields: Fields, listings: Record<Platform, Listing>) {
  const A = listings.airbnb
  const text = (field: 'title' | 'description') => {
    const c = choices[field]
    if (c === 'airbnb' || c === 'booking') return listings[c][field]
    if (c === 'mix') return fields[field].custom.trim()
    return A[field]
  }
  const fee = choices.cleaningFee
  const p = choices.photos
  const photos =
    p === 'airbnb' || p === 'booking'
      ? listings[p].photos
      : p === 'mix'
        ? selectedPhotos(fields)
        : unionPhotos(A.photos, listings.booking.photos)
  const coverFrom = p === 'booking' ? PLATFORM_NAME.booking : PLATFORM_NAME.airbnb
  return {
    title: text('title'),
    description: text('description'),
    cleaningFee: fee === 'airbnb' || fee === 'booking' ? listings[fee].cleaningFee.amount : A.cleaningFee.amount,
    photos,
    photosLabel:
      p === 'mix'
        ? `${photos.length} photos. Same set as Airbnb and Booking.com.`
        : p === 'airbnb' || p === 'booking'
        ? `${photos.length} photos. Same cover as ${coverFrom}.`
        : `${photos.length} unique photos. Same cover as ${coverFrom}.`,
  }
}

export function samePhotos(a: Photo[], b: Photo[]): boolean {
  return a.length === b.length && a.every((p, i) => p.id === b[i].id)
}

export function photoChangeLabel(next: Photo[], prev: Photo[]): string {
  const coverSame = next[0]?.id === prev[0]?.id
  if (samePhotos(next, prev)) return `${next.length} photos. Cover unchanged.`
  const prevIds = new Set(prev.map((p) => p.id))
  const nextIds = new Set(next.map((p) => p.id))
  const added = next.filter((p) => !prevIds.has(p.id)).length
  const removed = prev.filter((p) => !nextIds.has(p.id)).length
  let label = `${next.length} photos`
  if (added) label += `, ${added} added`
  if (removed) label += `, ${removed} removed`
  return `${label}. Cover ${coverSame ? 'unchanged' : 'changed'}.`
}

export type FieldRow = {
  field: FieldKey
  status: 'changed' | 'same' | 'new'
  value: string
  was?: string
  photos?: Photo[]
}

export function channelRows(platform: Platform, s: MergeData): FieldRow[] {
  const listings = getListings(s.variant)
  const own = listings[platform]
  const next = channelValues(platform, resolveChoices(s), s.fields, listings)
  const row = (field: FieldKey, changed: boolean, value: string, was: string, photos?: Photo[]): FieldRow => ({
    field,
    status: changed ? 'changed' : 'same',
    value,
    was: changed ? was : undefined,
    photos,
  })
  return [
    row('title', next.title !== own.title, next.title, own.title),
    row('description', next.description !== own.description, next.description, own.description),
    row(
      'cleaningFee',
      next.cleaningFee !== own.cleaningFee.amount,
      `${next.cleaningFee} EUR`,
      `${own.cleaningFee.amount} EUR`,
    ),
    row(
      'photos',
      !samePhotos(next.photos, own.photos),
      photoChangeLabel(next.photos, own.photos),
      `${own.photos.length} photos`,
      next.photos,
    ),
  ]
}

export function directRows(s: MergeData): FieldRow[] {
  const d = directValues(resolveChoices(s), s.fields, getListings(s.variant))
  return [
    { field: 'title', status: 'new', value: d.title },
    { field: 'description', status: 'new', value: d.description },
    { field: 'cleaningFee', status: 'new', value: `${d.cleaningFee} EUR` },
    { field: 'photos', status: 'new', value: d.photosLabel, photos: d.photos },
  ]
}

/** Name the merged property takes, from the lead listing */
export function propertyName(lead: Lead): string {
  return lead === 'booking' ? BOOKING_PROPERTY_NAME : getListings('full').airbnb.title
}

export function variantFields(variant: Variant): FieldKey[] {
  return VARIANT_CONFIG[variant].fields
}
