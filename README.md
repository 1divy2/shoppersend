<div align="center">
  <h1>🛒 ShoppersEnd</h1>
  <p><strong>A high-performance, full-stack e-commerce platform built for scale.</strong></p>
</div>

ShoppersEnd is a production-ready storefront designed to securely manage complex product catalogs, real-time inventory constraints, and seamless checkout flows. It features a blazing-fast Server-Side Rendered (SSR) frontend and a highly secure Java Spring Boot backend.

## ✨ Features

- **Blazing Fast Performance**: Full Server-Side Rendering (SSR) via TanStack Start for near-instant page loads and incredible SEO.
- **Robust Architecture**: Secure Spring Boot microservice architecture for handling complex transactions, inventory management, and user authentication.
- **Real-time Inventory**: Reliable and synchronized inventory tracking backed by a relational PostgreSQL database.
- **Beautiful & Accessible UI**: Modern, responsive interface carefully crafted with TailwindCSS, Radix UI primitives, and Framer Motion animations.
- **Secure Cart & Checkout**: End-to-end secure session and cart management.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TanStack Start (SSR)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel (Edge Network)

### Backend
- **Framework**: Java 21 + Spring Boot 3
- **Database**: PostgreSQL
- **Security**: Spring Security + Stateless JWT Auth
- **Deployment**: Render

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- Java JDK (v21+)
- PostgreSQL Database

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1divy2/shoppersend.git
   cd shoppersend
   ```

2. **Start the Spring Boot Backend:**
   Navigate to the `backend` directory, configure your application properties for PostgreSQL, and run:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Start the Frontend:**
   Open a new terminal in the root directory, install the Node dependencies, and start the Vite development server:
   ```bash
   npm install
   npm run dev
   ```

4. **Visit:** Open `http://localhost:5173` (or the port specified by Vite) in your browser!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
