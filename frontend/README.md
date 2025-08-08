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
