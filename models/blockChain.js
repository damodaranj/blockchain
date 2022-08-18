const sha256 = require("sha256");
const uuid = require("uuid");

class blockChain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.createNewBlock(0, 0, 0);
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(block);

    return block;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, recipient) {
    let newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient,
      transactionId: uuid.v4().split("-").join(""),
    };

    return newTransaction;
  }

  addTransactionToPendingTransactions(newTransactionObject) {
    this.pendingTransactions.push(
      this.createNewTransaction(
        newTransactionObject.amount,
        newTransactionObject.sender,
        newTransactionObject.recipient
      )
    );
    return this.getLastBlock()["index"] + 1;
  }

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  chainIsValid(blockchain) {
    let validChain = true;

    for (var i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock["hash"],
        {
          transactions: currentBlock["transactions"],
          index: currentBlock["index"],
        },
        currentBlock["nonce"]
      );
      if (blockHash.substring(0, 4) !== "0000") validChain = false;
      if (currentBlock["previousBlockHash"] !== prevBlock["hash"])
        validChain = false;
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock["nonce"] === 100;
    const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
    const correctHash = genesisBlock["hash"] === "0";
    const correctTransactions = genesisBlock["transactions"].length === 0;

    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    )
      validChain = false;

    return validChain;
  }

  getBlock(blockHash) {
    let correctBlock = null;
    this.chain.forEach((block) => {
      if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
  }

  getTransaction(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      });
    });

    return {
      transaction: correctTransaction,
      block: correctBlock,
    };
  }

  getAddressData(address) {
    const addressTransactions = [];
    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (
          transaction.sender === address ||
          transaction.recipient === address
        ) {
          addressTransactions.push(transaction);
        }
      });
    });

    let balance = 0;
    addressTransactions.forEach((transaction) => {
      if (transaction.recipient === address) balance += transaction.amount;
      else if (transaction.sender === address) balance -= transaction.amount;
    });
    return {
      addressTransactions: addressTransactions,
      addressBalance: balance,
    };
  }

  pendingTransactionAddToBlocks() {
    let lastBlock = this.getLastBlock();
    if (this.pendingTransactions.length === 0) {
      return "No pending transactions available";
    }
    let previousBlockHash = lastBlock["hash"];
    let currentBlockData = {
      transactions: this.pendingTransactions,
      index: lastBlock["index"] + 1,
    };
    let nonce = this.proofOfWork(previousBlockHash, currentBlockData);
    let blockHash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    let newBlock = this.createNewBlock(nonce, previousBlockHash, blockHash);
    return newBlock;
  }

  blockPendingTransactions(transactionId = "none") {
    let pendingTransactions = this.pendingTransactions;
    if (pendingTransactions.length != 0) {
      if (transactionId != "none") {
        return pendingTransactionsData.filter(
          (data) => data.transactionId == transactionId
        );
      }
      return pendingTransactions;
    }
    return "All transactions are up to date";
  }
}

module.exports = blockChain;
