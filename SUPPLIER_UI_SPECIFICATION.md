# Supplier Interface - UI/UX Design Specification

## Document Purpose

This specification defines the complete user interface design for the Supplier-side of the EasyStock logistics platform. It focuses exclusively on frontend components, layouts, interactions, and user experience flows.

**Scope:** Supplier Interface Only  
**Excluded:** Backend logic, APIs, database schemas, Vendor-side UI, Admin-side UI

---

## 1. Design Principles & UX Philosophy

### Core Principles

1. **Resilience-First Communication**

   - Delay reporting is encouraged, not penalized
   - Clear, non-punitive language around issues
   - Visual cues prioritize early warning over blame

2. **Zero-Onboarding Clarity**

   - All actions self-explanatory
   - Plain language labels (no jargon)
   - Obvious button purposes without tooltips

3. **Mobile-First, Responsive**

   - Suppliers may access from warehouse floor, delivery vehicle, or office
   - Touch-friendly controls (minimum 44px tap targets)
   - Optimized for quick actions under time pressure

4. **Visual Hierarchy for Urgency**

   - At-risk items immediately visible
   - Today's priorities prominent
   - Past orders recede but remain accessible

5. **Calm Error States**
   - Human, conversational error messages
   - No technical jargon in user-facing text
   - Clear recovery paths

---

## 2. Visual Design Language

### Color Palette

**Primary Actions & Status:**

- **Green (Success/Safe):** `#22C55E` - On-track orders, available inventory
- **Amber (Warning/At Risk):** `#F59E0B` - Orders at risk, low inventory
- **Red (Critical/Action Required):** `#EF4444` - Overdue, unavailable inventory
- **Blue (Primary Actions):** `#3B82F6` - Accept, confirm buttons
- **Gray (Neutral/Disabled):** `#6B7280` - Inactive states, secondary text

**Backgrounds:**

- **Page Background:** `#F9FAFB` (light gray)
- **Card Background:** `#FFFFFF` (white)
- **Hover States:** `#F3F4F6` (subtle gray)

**Text:**

- **Primary Text:** `#111827` (near black)
- **Secondary Text:** `#6B7280` (medium gray)
- **Tertiary Text:** `#9CA3AF` (light gray)

### Typography

**Font Family:** System fonts stack (San Francisco on iOS, Segoe UI on Windows, Roboto on Android)

**Scale:**

- **H1 (Page Titles):** 24px / 600 weight / 32px line-height
- **H2 (Section Headers):** 20px / 600 weight / 28px line-height
- **H3 (Subsection):** 18px / 600 weight / 24px line-height
- **Body (Primary):** 16px / 400 weight / 24px line-height
- **Body (Secondary):** 14px / 400 weight / 20px line-height
- **Small (Captions):** 12px / 400 weight / 16px line-height
- **Button Text:** 16px / 500 weight

### Spacing & Layout

**Grid System:** 8px base unit

- **XS Spacing:** 4px
- **S Spacing:** 8px
- **M Spacing:** 16px
- **L Spacing:** 24px
- **XL Spacing:** 32px
- **XXL Spacing:** 48px

**Container Widths:**

- **Mobile:** Full width (0-767px)
- **Tablet:** 768px max-width, centered (768px-1023px)
- **Desktop:** 1200px max-width, centered (1024px+)

**Card Padding:** 16px (mobile), 24px (desktop)

### Component Standards

**Border Radius:** 8px (cards, buttons), 4px (input fields)
**Shadows:**

- Card: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Elevated/Hover: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`

**Button Heights:** 44px (primary), 36px (secondary)
**Input Heights:** 44px

---

## 3. Authentication Flow

### Screen: Passwordless Login

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│        [EasyStock Logo]             │
│        Supplier Portal              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Email or Phone Number         │  │
│  │ [Input field____________]     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Send Magic Link               │  │
│  └───────────────────────────────┘  │
│                                     │
│  We'll send a secure link to        │
│  your email/phone. No password      │
│  needed.                            │
│                                     │
└─────────────────────────────────────┘
```

**Interactions:**

- Single input field accepts email or phone number
- Validates format on blur (shows inline error if invalid)
- Button disabled until valid input
- On submit: Shows loading state, then success message
- Success message: "Check your email/phone for the login link. It expires in 15 minutes."

**Error States:**

- Invalid email: "Please enter a valid email address"
- Invalid phone: "Please enter a valid phone number (include country code)"
- Network error: "Couldn't send link. Please check your connection and try again."

**Magic Link Email/SMS Template:**

- Subject: "Your EasyStock login link"
- Body: "Click here to access your supplier dashboard: [Link] (expires in 15 minutes)"

---

## 4. Dashboard (Primary Screen)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Dashboard                    [Profile ▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  Today's Status      │  │  Orders at Risk      │        │
│  │  Active Orders: 12   │  │  ⚠️ 3 orders         │        │
│  │  New Requests: 5     │  │  Requires attention  │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  New Order Requests (5)                               │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  [Order Card] [Order Card] [Order Card] ...          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Active Orders (12)                                   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  [Order Card] [Order Card] [Order Card] ...          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Inventory Quick Controls                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  [Inventory Toggle List]                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component: Today's Status Cards

**Card 1: Active Orders**

- **Background:** White card
- **Icon:** List/briefcase icon (left)
- **Number:** Large, bold (24px)
- **Label:** "Active Orders"
- **Color:** Blue (`#3B82F6`)
- **Clickable:** Links to Active Orders section

**Card 2: Orders at Risk**

- **Background:** Amber tint (`#FEF3C7`) if risk > 0, white otherwise
- **Icon:** Warning icon (⚠️)
- **Number:** Large, bold (24px) - red if > 0
- **Label:** "Orders at Risk"
- **Color:** Amber/Red based on count
- **Additional Text:** "Requires attention" (only if > 0)
- **Clickable:** Filters Active Orders to show only at-risk items

### Component: New Order Request Card

**Card Structure:**

```
┌─────────────────────────────────────────────────────┐
│  [Badge: NEW]                                       │
│  Retailer: Acme Hardware                            │
│                                                      │
│  Items:                                             │
│  • Steel Bolts (M8 x 20mm) - Qty: 500              │
│  • Wire Nuts (Blue) - Qty: 200                     │
│                                                      │
│  Required Delivery: Dec 15, 2024                    │
│  Order ID: #ORD-2024-1234                           │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Accept     │  │   Decline    │                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

**Visual Design:**

- **Border:** 2px solid blue on left edge (indicates new/unread)
- **Badge:** "NEW" badge in top-right (blue background, white text)
- **Layout:** Vertical stack with clear spacing
- **Actions:** Full-width buttons on mobile, side-by-side on desktop

**Interaction:**

- **Accept:** Immediate confirmation, order moves to Active Orders
- **Decline:** Opens modal (see Decline Order Modal below)

**Empty State:**

- If no new requests: "No new order requests. New requests will appear here."

### Component: Active Order Card

**Card Structure:**

```
┌─────────────────────────────────────────────────────┐
│  Order #ORD-2024-1234      [Status: On Track]      │
│  Retailer: Acme Hardware                            │
│                                                      │
│  Items:                                             │
│  • Steel Bolts - Qty: 500                           │
│                                                      │
│  ETA: Dec 15, 2024 by 5:00 PM                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  [View Details]  [Delivery at Risk]          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Status Badges:**

- **On Track:** Green background (`#D1FAE5`), green text (`#065F46`), checkmark icon
- **At Risk:** Amber background (`#FEF3C7`), amber text (`#92400E`), warning icon

**Interaction:**

- **Click card:** Opens Order Detail View
- **Delivery at Risk button:** Opens Delay Notification Modal (see below)

**At-Risk Visual Treatment:**

- Amber border (2px) on left edge
- Slightly elevated shadow
- Warning icon next to status

**Sorting:**

- Default: At-risk orders first, then by ETA (soonest first)
- User can toggle: "Show all" / "Show at-risk only"

### Component: Inventory Quick Controls

**Section Header:**

- Title: "Inventory Quick Controls"
- Subtitle: "Update availability as you check your stock"

**Toggle List:**

```
┌─────────────────────────────────────────────────────┐
│  SKU: M8-BOLT-20        [Available ▼]              │
│  SKU: WIRE-NUT-BLUE     [Low ▼]                    │
│  SKU: SCREW-6X32        [Unavailable ▼]            │
└─────────────────────────────────────────────────────┘
```

**Toggle States:**

- **Available:** Green indicator dot + "Available" text
- **Low:** Amber indicator dot + "Low" text
- **Unavailable:** Red indicator dot + "Unavailable" text

**Interaction:**

- Clicking toggle opens dropdown with 3 options
- Selection immediately updates (no confirmation)
- If change affects active orders, shows inline notification: "⚠️ This change affects 2 active orders"

**Empty State:**

- "No inventory items yet. Items will appear here as you receive orders."

**Search/Filter (Desktop):**

- Search bar above list to filter SKUs
- Shows count: "Showing 5 of 23 items"

---

## 5. Order Detail View

### Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Order #ORD-2024-1234          [Status: On Track]           │
│  Retailer: Acme Hardware                                     │
│  Placed: Dec 10, 2024                                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📦 Order Items                                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Steel Bolts (M8 x 20mm)         Qty: 500    $250   │  │
│  │  SKU: M8-BOLT-20                                    │  │
│  │                                                      │  │
│  │  Wire Nuts (Blue)               Qty: 200     $80    │  │
│  │  SKU: WIRE-NUT-BLUE                                 │  │
│  │                                                      │  │
│  │  Subtotal:                                $330      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📅 Delivery Information                              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Required Date: Dec 15, 2024                         │  │
│  │  Required Time: By 5:00 PM                           │  │
│  │  Delivery Address: 123 Main St, City, State 12345   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ⚠️ Delivery Commitment                              │  │
│  │  Only accept if you can deliver as promised.         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📋 Activity Log                                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Dec 14, 10:30 AM - Delivery at risk reported        │  │
│  │  Dec 10, 2:15 PM - Order accepted                    │  │
│  │  Dec 10, 2:10 PM - Order received from retailer      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Accept     │  │   Decline    │  │  At Risk     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**For Active Orders (already accepted):**

- Remove Accept/Decline buttons
- Show "Delivery at Risk" and "Mark Delivered" buttons
- Activity Log includes delivery updates

**Proof of Delivery Section (when marking delivered):**

```
┌──────────────────────────────────────────────────────┐
│  📸 Proof of Delivery                                │
├──────────────────────────────────────────────────────┤
│  [Camera Icon]                                       │
│  Tap to upload photo                                 │
│                                                      │
│  Optional Signature: [Signature Pad]                 │
│                                                      │
│  Timestamp: Auto-filled on submit                    │
└──────────────────────────────────────────────────────┘
```

---

## 6. Decline Order Modal

### Modal Structure

```
┌─────────────────────────────────────────────────────┐
│  Decline Order #ORD-2024-1234           [X Close]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Please select a reason for declining:              │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  [Dropdown ▼]                                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Optional notes (visible to retailer):              │
│  ┌──────────────────────────────────────────────┐  │
│  │  [Text area - 3 rows]                        │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Cancel     │  │   Decline    │                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

**Dropdown Options:**

- Out of stock
- Cannot meet delivery date
- Item discontinued
- Pricing issue
- Other (triggers note requirement)

**Validation:**

- Reason required
- Notes required if "Other" selected
- Decline button disabled until valid

**Confirmation:**

- On submit: "Order declined. The retailer has been notified."

---

## 7. Delay Notification Modal (Critical Feature)

### Modal Structure

```
┌─────────────────────────────────────────────────────┐
│  Report Delivery Delay            [X Close]         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Order #ORD-2024-1234                               │
│  Original ETA: Dec 15, 2024 by 5:00 PM             │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Reason *                                    │  │
│  │  [Dropdown ▼]                                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Revised ETA (optional)                      │  │
│  │  [Date picker]  [Time picker]                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Optional notes (visible to retailer):              │
│  ┌──────────────────────────────────────────────┐  │
│  │  [Text area - 3 rows]                        │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ℹ️ Reporting delays early helps retailers plan.   │
│  This action is encouraged and will not affect     │
│  your standing.                                     │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Cancel     │  │  Report Delay│                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

**Reason Dropdown Options:**

- Manufacturing delay
- Shipping delay
- Material shortage
- Weather/transport issue
- Quality issue
- Other

**Design Tone:**

- **Calm, supportive language** (not punitive)
- **Info message** emphasizes this is encouraged
- **Visual:** Gentle amber/warm tones (not red/alarm)

**After Submit:**

- Modal closes
- Order card updates to "At Risk" status immediately
- Toast notification: "Delay reported. Retailer notified."
- Event logged in Activity Log

**One-Click Shortcut (From Order Card):**

- Long-press or swipe left on "Delivery at Risk" button shows quick menu
- Quick options: "1 day late", "2-3 days late", "Week late"
- Selecting quick option still opens modal for confirmation/notes

---

## 8. Proof of Delivery Component

### Photo Upload Interface

**Upload Method:**

- **Mobile:** Native camera capture or gallery picker
- **Desktop:** File picker (accepts image files)

**Preview:**

- After selection, shows thumbnail preview
- Delete/retake option
- Multiple photos supported (max 5)

**Signature Capture (Optional):**

- Canvas-based signature pad
- Clear button to reset
- Save button to confirm signature
- Disabled if no photo uploaded

**Submit Button:**

- "Mark as Delivered"
- Disabled until at least photo OR signature provided
- Auto-timestamp: "Delivered on [Date] at [Time]"

**Success State:**

- Order moves to "Delivered" status
- Confirmation: "Delivery confirmed. Proof of delivery saved."

---

## 9. Inventory Management (Detailed View)

### Screen: Full Inventory List

**Access:** Link from "Inventory Quick Controls" section

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                         │
├─────────────────────────────────────────────────────────────┤
│  Inventory Management                                        │
│                                                              │
│  [Search SKU...]                          [Filter ▼]        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SKU          Name            Status      Actions    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  M8-BOLT-20   Steel Bolts     Available   [Edit ▼]  │  │
│  │  WIRE-NUT-B   Wire Nuts       Low         [Edit ▼]  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Manual Override Modal:**

```
┌─────────────────────────────────────────────────────┐
│  Update Inventory Status         [X Close]          │
├─────────────────────────────────────────────────────┤
│  SKU: M8-BOLT-20                                    │
│  Name: Steel Bolts                                  │
│                                                      │
│  Current Status: Available                          │
│                                                      │
│  New Status: *                                      │
│  [Available] [Low] [Unavailable]                    │
│                                                      │
│  Reason for change: *                               │
│  ┌──────────────────────────────────────────────┐  │
│  │  [Dropdown ▼]                                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Notes (optional):                                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  [Text area]                                 │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ⚠️ This change affects 2 active orders            │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Cancel     │  │    Save      │                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

**Reason Options:**

- Physical count checked
- Received new shipment
- Stock depleted
- Item damaged
- Other

**Alert for Active Orders:**

- If status change (e.g., Available → Unavailable) affects active orders, show warning
- Lists affected order IDs
- Allows proceeding or canceling

---

## 10. Event Log / Activity Timeline

### Component: Activity Log (In Order Detail)

**Design:**

- Vertical timeline with connecting lines
- Each event as a card on timeline
- Most recent at top

**Event Types & Icons:**

- Order received: 📥 (inbox icon)
- Order accepted: ✓ (checkmark, green)
- Order declined: ✗ (X, gray)
- Delay reported: ⚠️ (warning, amber)
- Status updated: 🔄 (refresh icon)
- Delivery completed: ✅ (checkmark circle, green)
- Inventory adjusted: 📦 (package icon)

**Event Card:**

```
┌─────────────────────────────────────────────────────┐
│  [Icon]  Event Title                                │
│          Timestamp: Dec 14, 2024 at 10:30 AM       │
│          Details: [Reason/notes if applicable]      │
└─────────────────────────────────────────────────────┘
```

**Filter Options (Desktop):**

- Show all events
- Show delays only
- Show status changes only

---

## 11. Responsive Breakpoints

### Mobile (0-767px)

- Single column layout
- Full-width buttons
- Stacked cards
- Bottom navigation (if needed for future features)
- Hamburger menu for profile/settings

### Tablet (768px-1023px)

- Two-column layout for status cards
- Side-by-side buttons where appropriate
- Maintained touch targets (44px minimum)

### Desktop (1024px+)

- Multi-column layouts
- Hover states for interactive elements
- Keyboard navigation support
- Maximum container width: 1200px

---

## 12. Loading & Error States

### Loading States

**Skeleton Screens:**

- Show content placeholders during data fetch
- Animate with subtle pulse
- Maintain layout structure

**Button Loading:**

- Spinner icon replaces text temporarily
- Button disabled during action
- Text: "Processing..." or "Saving..."

**Full-Page Loading:**

- Centered spinner
- Message: "Loading your dashboard..."

### Error States

**Network Errors:**

- Message: "Couldn't load data. Please check your connection."
- Retry button
- Non-blocking if possible (show cached/partial data)

**Form Validation Errors:**

- Inline error messages below fields
- Red border on invalid input
- Clear error text (no technical jargon)

**404 / Not Found:**

- Message: "Order not found. It may have been canceled or doesn't exist."
- Link back to dashboard

**Empty States:**

- Friendly illustration or icon
- Clear message explaining why it's empty
- Suggested action if applicable

**Example Empty States:**

- No orders: "No orders yet. When retailers place orders, they'll appear here."
- No inventory: "Start tracking inventory by updating status on your first order."

---

## 13. Accessibility Requirements

### Keyboard Navigation

- All interactive elements keyboard accessible
- Tab order follows visual flow
- Focus indicators clearly visible (2px blue outline)
- Enter/Space to activate buttons

### Screen Readers

- Semantic HTML elements (buttons, links, headings)
- ARIA labels for icon-only buttons
- Status announcements for dynamic updates
- Error messages associated with form fields

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Status indicators use both color and icons/text

### Touch Targets

- Minimum 44x44px for all interactive elements
- Adequate spacing between buttons (8px minimum)

---

## 14. Animation & Transitions

### Principles

- **Subtle and purposeful** - animations guide attention, don't distract
- **Fast** - transitions complete in 150-300ms
- **Consistent** - same animation type for similar actions

### Specific Animations

**Page Transitions:**

- Fade in: 200ms
- Slide in from right (mobile): 300ms

**Button Interactions:**

- Hover: Slight scale (1.02) and shadow increase
- Active/Press: Scale down (0.98)
- Loading: Spinner rotation

**Status Changes:**

- Status badge color transitions smoothly
- At-risk indicators fade in (300ms)

**Notifications/Toasts:**

- Slide in from top (300ms)
- Auto-dismiss after 4 seconds
- Slide out on dismiss

**Modal Appearance:**

- Fade in with backdrop (200ms)
- Slight scale animation (0.95 → 1.0)

---

## 15. Component Library Summary

### Atomic Components

1. **Buttons**

   - Primary (blue, full width mobile)
   - Secondary (outline, gray)
   - Danger (red, for decline/delete)
   - Icon buttons (44x44px)

2. **Inputs**

   - Text input (44px height)
   - Textarea (min 3 rows)
   - Dropdown/Select (native-style with custom arrow)
   - Date/Time pickers (native with fallback)

3. **Cards**

   - Order card (hover elevation)
   - Status card (color-coded)
   - Info card (white background, padding)

4. **Badges**

   - Status badges (colored backgrounds)
   - Count badges (small circles with numbers)
   - New/Unread badges

5. **Modals**

   - Centered overlay
   - Backdrop blur/darken
   - Close button (X) and ESC key support
   - Max width: 600px on desktop

6. **Toast Notifications**

   - Top-right position (desktop)
   - Top-center (mobile)
   - Auto-dismiss with manual close option

7. **Loading Indicators**
   - Spinner (circular)
   - Skeleton screens
   - Inline loading states

---

## 16. User Flow Diagrams

### Flow 1: New Order Acceptance

```
Dashboard
  ↓
View New Order Card
  ↓
Click "Accept" OR Click Card → Order Detail
  ↓
Review Order Details
  ↓
Click "Accept"
  ↓
Confirmation → Order moves to Active Orders
```

### Flow 2: Delay Reporting

```
Dashboard OR Order Detail
  ↓
Click "Delivery at Risk" button
  ↓
Delay Notification Modal opens
  ↓
Select reason (required)
  ↓
Optionally: Set revised ETA, add notes
  ↓
Click "Report Delay"
  ↓
Modal closes, Order status → "At Risk"
  ↓
Toast notification + Event logged
```

### Flow 3: Proof of Delivery

```
Order Detail (Active Order)
  ↓
Click "Mark Delivered"
  ↓
Proof of Delivery interface opens
  ↓
Upload photo (required) OR Capture signature (optional)
  ↓
Review preview
  ↓
Click "Confirm Delivery"
  ↓
Order → "Delivered" status
  ↓
Success message + Event logged
```

---

## 17. Implementation Notes

### Technology Recommendations

**Frontend Framework:** React or Vue.js (component-based architecture)

**UI Library Base:**

- Tailwind CSS (utility-first for rapid development)
- Or Material-UI / Ant Design (component library with customization)

**State Management:**

- Context API (React) or Vuex (Vue) for global state
- Local state for form inputs and UI toggles

**Form Handling:**

- React Hook Form or Formik (React)
- VeeValidate (Vue)

**Date/Time:**

- date-fns or day.js (lightweight date utilities)

**Icons:**

- Heroicons or Feather Icons (consistent, minimal style)

**Image Handling:**

- Native file input with preview
- Image compression before upload (client-side)

### Mock Data Structure (For Frontend Development)

```javascript
// Example structure (not a backend schema definition)
const mockOrder = {
  id: "ORD-2024-1234",

  retailerId: "RET-001",
  retailerName: "Acme Hardware",

  orderState: "accepted", // pending | accepted | declined
  deliveryState: "on_track", // on_track | at_risk | delivered

  isNew: false,
  requiresAttention: false,

  items: [
    {
      sku: "M8-BOLT-20",
      name: "Steel Bolts (M8 x 20mm)",
      quantity: 500,
      price: 0.5,
    },
  ],

  requiredDeliveryDate: "2024-12-15",
  requiredDeliveryTime: "17:00",

  committedETA: "2024-12-15T17:00:00Z",

  deliveryAddress: "123 Main St, City, State 12345",

  placedAt: "2024-12-10T14:10:00Z",

  proofOfDelivery: {
    photos: [],
    signature: null,
    deliveredAt: null,
  },

  events: [
    {
      type: "order_received",
      timestamp: "2024-12-10T14:10:00Z",
      details: null,
    },
    {
      type: "order_accepted",
      timestamp: "2024-12-10T14:15:00Z",
      details: null,
    },
  ],
};

```

### Performance Considerations

- **Lazy Loading:** Load order details on-demand
- **Pagination:** For inventory lists > 50 items
- **Image Optimization:** Compress photos before upload
- **Debouncing:** Search inputs debounced (300ms)
- **Caching:** Cache dashboard data for 30 seconds

---

## 18. Success Metrics (UX Goals)

### User Experience Goals

1. **Time to First Action:** Supplier can accept/decline order in < 30 seconds
2. **Delay Reporting:** < 3 clicks to report a delay from dashboard
3. **Zero Training:** New suppliers can use core features without tutorial
4. **Error Recovery:** Clear path from any error state back to workflow
5. **Mobile Usage:** Fully functional on mobile devices (not desktop-only)

---

## 19. Future Considerations (Out of Current Scope)

**Not in v1, but design should allow:**

- Notification preferences/settings
- Multi-language support (text externalization)
- Dark mode (color palette defined to support)
- Bulk actions (accept multiple orders)
- Order history/search
- Supplier profile/settings page

---

## 20. Design Deliverables Checklist

- [x] Component specifications
- [x] Screen layouts and wireframes (text-based)
- [x] User flow diagrams
- [x] Color palette and typography
- [x] Interaction patterns
- [x] Responsive breakpoints
- [x] Error and loading states
- [x] Accessibility guidelines
- [ ] High-fidelity mockups (would require design tool)
- [ ] Interactive prototype (would require prototyping tool)

---

## System Behavior Under Failure Conditions (Design Intent)

The UI remains usable even when:

Inventory data is outdated

Orders are incomplete

Network connectivity is intermittent

The system prioritizes:

Manual confirmation over automation

User intent over inferred accuracy

All critical actions are:

Explicit

Logged

Reversible where possible

--

## Conclusion

This specification provides a complete foundation for implementing the Supplier-side interface of EasyStock. The design prioritizes clarity, resilience communication, and mobile-first accessibility while maintaining a calm, professional tone appropriate for B2B supply-chain operations.

**Key Design Themes:**

- **Resilience-first:** Delay reporting encouraged and easy
- **Zero-onboarding:** Self-explanatory interface
- **Mobile-optimized:** Functional on any device
- **Calm communication:** Supportive, non-punitive language

The frontend development team can use this specification to build the interface, making technology choices that best fit their stack while adhering to the design principles and component specifications outlined above.

---

_Document Version: 1.0_  
_Last Updated: [Date]_  
_Scope: Supplier Interface UI/UX Design Only_
