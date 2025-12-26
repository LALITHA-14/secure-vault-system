#!/bin/sh
# Wait for blockchain node to be ready
sleep 5
# Compile contracts
npx hardhat compile
# Deploy contracts to localhost network
npx hardhat deploy --network localhost
# Keep container alive for logs
tail -f /dev/null
