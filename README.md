# Blockchain Voting System

A secure, transparent, and decentralized voting platform powered by blockchain technology. This application allows users to cast votes that are recorded on the blockchain, ensuring transparency and immutability.

## Features

- **Secure Authentication**: User registration and login with JWT tokens
- **Blockchain Integration**: Votes are recorded on the Ethereum blockchain
- **Real-time Results**: View voting results as they are recorded
- **Mock Mode**: Test the application without a blockchain connection
- **Modern UI**: Built with React and Material-UI

## Tech Stack

- **Frontend**: React, Material-UI, ethers.js
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, bcrypt
- **Blockchain**: Ethereum (optional)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/bhavana9635/Voting-System.git
cd Voting-System
```

2. Install dependencies
```
npm install
cd client
npm install
cd ..
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_contract_address_here
MONGODB_URI=mongodb://localhost:27017/blockchain-voting
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the application
```
# Start the backend server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

5. Access the application at http://localhost:3000

## Usage

- Register a new account or log in with existing credentials
- Cast your vote on the Vote page
- View real-time results on the Results page
- Log out when finished

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ethereum Foundation
- React Team
- Material-UI Team
