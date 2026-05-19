#!/bin/sh

echo "Starting Hardhat node..."

npx hardhat node &

sleep 12

echo "Deploying contracts..."

npx hardhat run scripts/deploy.js --network localhost

echo "Contracts deployed successfully."

tail -f /dev/null