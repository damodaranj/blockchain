const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 9000;
const blockChain = require("./models/blockChain");
const Blockchain = new blockChain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Blockchain application");
});

app.get("/blockchain", (req, res) => {
  res.send(Blockchain);
});

app.post("/transaction", (req, res) => {
  newTransaction = req.body;
  let blockIndex =
    Blockchain.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get("/approvePendingTransaction", (req, res) => {
  res.json({ blockAdd: Blockchain.pendingTransactionAddToBlocks() });
});

app.get("/block/:blockHash", (req, res) => {
  const blockHash = req.params.blockHash;
  const correctBlock = Blockchain.getBlock(blockHash);
  res.json({
    block: correctBlock,
  });
});

app.get("/transaction/:transactionId", (req, res) => {
  let transactionId = req.params.transactionId;
  let trasactionData = Blockchain.getTransaction(transactionId);
  res.json({
    transaction: trasactionData.transaction,
    block: trasactionData.block,
  });
});

app.get("/transaction", (req, res) => {
  let trasactionData = Blockchain.getTransaction();
  res.json({
    transaction: trasactionData.transaction,
    block: trasactionData.block,
  });
});

app.get("/address/:address", (req, res) => {
  let address = req.params.address;
  let addressData = Blockchain.getAddressData(address);
  res.json({
    addressData: addressData,
  });
});

app.get("/pendingTransaction", (req, res) => {
  const pendingTransactionsData = Blockchain.blockPendingTransactions();
  res.json({
    pendingTransactionsData,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
