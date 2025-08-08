"use client";
import Footer from "@/components/shared/dash-footer";
import Header from "@/components/shared/header";
import SideBar from "@/components/shared/sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  return (
    <div className=" bg-white lg:p-1.5">
      {/* Page Wrapper Start  */}
      <div className="flex h-screen gap-1 overflow-hidden">
        {/* Sidebar Start */}
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Sidebar End  */}

        {/* Content Area Start  */}
        <div className="relative flex min-h-screen rounded-t-[8px] bg-white flex-1 border border-[#E5E7EB] flex-col justify-between overflow-y-auto overflow-x-hidden no-scrollbar">
          <section>
            {/*  Header Start */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/*  Header End */}

            {/*  Main Content Start */}
            <main>
              <div className="mx-auto 2xl:max-w-screen-2xl max-w-[800px] mt-4 pb-6 md:pt-4 md:pb-10 2xl:p-10">
                <section className="w-full lg:px-1.5 px-3">{children}</section>
              </div>
            </main>
          </section>
          {/*  Main Content End  */}
          <Footer />
        </div>
        {/*  Content Area End  */}
      </div>
      {/*  Page Wrapper End  */}
    </div>
  );
}

/*
# Chronify

Chronify is a decentralized supply chain management platform built on the Hedera network. It provides a transparent and immutable way to track products from origin to destination, ensuring accountability and reducing fraud.

## Features

*   **Product Tracking:** Register and track products throughout the supply chain.
*   **Party Management:** Onboard and manage different parties involved in the supply chain (e.g., manufacturers, suppliers, distributors).
*   **Real-time Analytics:** A comprehensive dashboard to visualize and analyze supply chain data.
*   **Decentralized & Secure:** Built on the Hedera network for enhanced security and transparency.

## Tech Stack

*   **Frontend:** Next.js, TypeScript, Tailwind CSS
*   **Smart Contracts:** Solidity, Foundry
*   **Network:** Hedera

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [Foundry](https://getfoundry.sh/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chronify.git
    cd chronify
    ```

2.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install smart contract dependencies:**
    ```bash
    forge install
    ```

### Running the Application

1.  **Start a local development node:**
    ```bash
    anvil
    ```

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing

To run the smart contract tests, use the following command:

```bash
forge test
```

## Project Structure

*   `frontend/`: Contains the Next.js frontend application.
*   `src/`: Contains the Solidity smart contracts.
*   `lib/`: Contains third-party libraries for the smart contracts.
*/
