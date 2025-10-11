# AgroConnect

## Overview

AgroConnect is a French-language agricultural marketplace web application that connects three key stakeholders in the food supply chain: producers (farmers), restaurants, and consumers. The platform enables direct transactions between producers and buyers, eliminating intermediaries and promoting local, sustainable food commerce.

The application is built as a static website using vanilla HTML, CSS, and JavaScript with localStorage for data persistence. It features a modern, dark-themed design inspired by Spotify's aesthetic, with smooth animations and a professional user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- Pure HTML5, CSS3, and vanilla JavaScript (no frameworks or libraries)
- Google Fonts (Poppins) for typography
- CSS custom properties for theming and consistent styling
- LocalStorage API for client-side data persistence

**Design System**
- Dark theme with Spotify-inspired aesthetics
- Color scheme defined via CSS variables:
  - Primary green (#1DB954) for CTAs and highlights
  - Dark backgrounds (#121212, #1a1a1a, #282828)
  - Text colors (white, gray variants)
- Responsive grid layouts using CSS Grid and Flexbox
- Smooth animations and transitions throughout

**Page Structure**
1. **Public Pages** (unauthenticated):
   - `index.html` - Landing page with hero section, features, testimonials, FAQ
   - `about.html` - Mission, vision, and company story
   - `services.html` - Service offerings for each user type
   - `register.html` - Multi-role registration system

2. **Protected Pages** (authenticated):
   - `dashboard.html` - Role-specific dashboard (producer/restaurant/client views)
   - `product.html` - Detailed product view
   - `cart.html` - Shopping cart and checkout

**Navigation System**
- Sticky navigation bar with blur effect
- Role-based navigation items (changes post-authentication)
- Cart counter badge for authenticated users

### Authentication & Authorization

**User Roles**
The system supports three distinct user types:
1. **Producer (Producteur)** - Farmers/suppliers who list products
2. **Restaurant** - Food service businesses that purchase products
3. **Client** - Individual consumers

**Authentication Flow**
- Client-side authentication using localStorage
- No backend validation (simulation only)
- User data stored as JSON in localStorage with key `currentUser`
- Registration forms are role-specific with different fields per user type
- Login modal accessible via:
  - Navigation "Connexion" link (redirects to register.html?action=login)
  - "Se connecter" link on registration page
- Auto-shows login modal when ?action=login parameter is present

**Session Management**
- Current user session persisted in `localStorage.getItem('currentUser')`
- Logout functionality clears session data
- Page access control via JavaScript checks
- Protected pages (dashboard.html, product.html, cart.html) redirect unauthenticated users to register.html
- Authentication guards run after script.js initialization

### Data Storage & Management

**LocalStorage Schema**
All data persistence uses browser localStorage with the following keys:

1. **User Data** (`currentUser`):
```javascript
{
  id: timestamp,
  role: 'producer|restaurant|client',
  name: string,
  email: string,
  // Role-specific fields vary
}
```

2. **Products** (`allProducts`):
```javascript
[{
  id: timestamp,
  name: string,
  category: string,
  price: number,
  quantity: number,
  location: string,
  description: string,
  sellerId: number,
  sellerName: string
}]
```

3. **Shopping Cart** (`cart`):
```javascript
[{
  productId: number,
  quantity: number,
  // Product details copied for display
}]
```

**Data Operations**
- CRUD operations for products (producers only)
- Cart management (add, remove, update quantities)
- Order placement (simulated, stored in localStorage)
- Search and filter functionality for product discovery

### Core Features

**Producer Dashboard**
- Product listing management (create, view, edit, delete)
- Product publication with form including: name, category, description, price, quantity, location
- View all published products in grid layout

**Client/Restaurant Dashboard**
- Browse all available products from all producers
- Search functionality (text-based product search)
- Category filtering (fruits, légumes, viande, produits laitiers, céréales, autre)
- Add to cart functionality
- View product details on dedicated page

**Shopping Cart System**
- Add/remove products
- Quantity adjustment
- Price calculation (subtotal, shipping, total)
- Order placement (simulated)
- Cart persistence across sessions

**UI/UX Patterns**
- Toast notifications for user feedback
- Modal dialogs for product creation
- Scroll reveal animations
- FAQ accordion interface
- Empty state handling
- Form validation

### JavaScript Architecture

**Core Functions** (`script.js`):
- `currentUser` - Global state for authenticated user
- `allProducts` - Global product catalog
- `cart` - Global shopping cart state
- `showToast()` - Notification system
- `selectRole()` - Role selection in registration
- Form submission handlers for each user type
- Product filtering and search
- Cart operations (add, remove, calculate totals)
- Authentication (login/logout/session management)

**Event Handling**
- Form submissions (preventDefault patterns)
- Dynamic content loading
- Click handlers for interactive elements
- Input change handlers for real-time filtering

## External Dependencies

**Third-Party Services**
- **Google Fonts API**: Poppins font family loading
  - Weight variants: 300, 400, 500, 600, 700
  - Used for consistent typography across the application

**Asset Requirements**
- Image assets referenced but not included in repository:
  - Hero background images (about.jpg, farm/market imagery)
  - Product images (dynamically referenced)
  - Expected to be placed in `images/` directory

**Browser APIs**
- **localStorage API**: Primary data persistence mechanism
  - Stores user sessions, products, cart data
  - No expiration handling implemented
- **DOM API**: Standard manipulation and event handling
- **CSS Custom Properties**: For theming system

**No Backend Integration**
- Pure client-side application
- No database connections
- No API calls to external services
- No authentication server
- All functionality simulated in browser

**Development Requirements**
- Modern browser with ES6+ JavaScript support
- localStorage enabled
- No build tools or bundlers required
- No package manager (npm/yarn) needed