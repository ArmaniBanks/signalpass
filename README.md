# SignalPass

SignalPass is a Stellar-powered pay-to-verify risk screening app built for the Stellar Agents hackathon.

It helps users pay a small amount in XLM before acting on a token, wallet, or project, then returns a structured risk verdict with a score, insight, risk signals, and next steps.

## Live Demo
[signalpass.vercel.app](https://signalpass.vercel.app)

## GitHub Repository
[github.com/ArmaniBanks/signalpass](https://github.com/ArmaniBanks/signalpass)

## What it does
SignalPass lets users:

- choose a scan type
- enter a token, wallet, or project input
- connect a Stellar wallet through Freighter
- pay in XLM on Stellar Testnet
- receive a structured trust and risk analysis

## Core Flow
1. Select a scan type  
2. Enter the item to verify  
3. Connect Freighter wallet  
4. Pay with XLM on Stellar Testnet  
5. Receive a risk verdict and trust score  

## Stellar Integration
This project includes real Stellar Testnet interaction:

- Freighter wallet connection
- XLM payment flow
- transaction hash confirmation on success

## Why it matters
Crypto users often act too fast on hype, unknown wallets, fake airdrops, and unverified projects.

SignalPass adds a payment-gated verification layer before action, helping users slow down and check risk first.

## Tech Stack
- React
- Vite
- JavaScript
- Stellar Testnet
- Freighter Wallet
- Vercel

## Submission Notes
This project was built as a hackathon MVP focused on:

- working Stellar wallet interaction
- real XLM payment flow on testnet
- simple user experience
- clear risk-verdict output

## Author
Built by ArmaniBanks

## License
MIT
