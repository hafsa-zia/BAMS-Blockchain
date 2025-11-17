// Block class used in-memory to construct blocks before saving into a chain array
const CryptoJS = require("crypto-js");

class Block {
  constructor(index, transactions, timestamp, prevHash = "") {
    this.index = index;
    this.transactions = transactions; // object or array
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      String(this.index) +
      String(this.timestamp) +
      JSON.stringify(this.transactions) +
      String(this.prevHash) +
      String(this.nonce)
    ).toString();
  }

  mineBlock(difficulty = 4) {
    const prefix = "0".repeat(difficulty);
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this.hash;
  }
}

module.exports = Block;
