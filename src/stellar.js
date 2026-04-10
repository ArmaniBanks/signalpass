import {
  isConnected,
  setAllowed,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export async function connectFreighterWallet() {
  const connected = await isConnected();

  if (!connected.isConnected) {
    throw new Error("Freighter wallet is not installed or not available.");
  }

  const allowed = await setAllowed();
  if (allowed.error) {
    throw new Error(allowed.error);
  }

  const addressResult = await getAddress();
  if (addressResult.error) {
    throw new Error(addressResult.error);
  }

  return addressResult.address;
}

export async function sendTestnetPayment({
  senderPublicKey,
  destination,
  amount,
}) {
  const senderAccount = await server.loadAccount(senderPublicKey);

  const fee = await server.fetchBaseFee();

  const transaction = new TransactionBuilder(senderAccount, {
    fee: fee.toString() || BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(120)
    .build();

  const signedXdr = await signTransaction(transaction.toXDR(), {
    networkPassphrase: Networks.TESTNET,
  });

  if (signedXdr.error) {
    throw new Error(signedXdr.error);
  }

  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr.signedTxXdr,
    Networks.TESTNET
  );

  const result = await server.submitTransaction(signedTransaction);

  return result;
}