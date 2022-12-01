const SHA256 = require("crypto-js/sha256");

class User{
    constructor(name, password){
        this.name = name;
        this.password = password;
    }
}

class Transaction {
    constructor(fromAddress, toAddress, amount) {
      this.fromAddress = fromAddress;
      this.toAddress = toAddress;
      this.amount = amount;
      this.timestamp = Date.now();
    }
}

class Block{
    constructor(index, timestamp, data, previousHash = ""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }
    createGenesisBlock() {
        return new Block(0, "02/12/2022", "Genesis Block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        let balance = 0;
    
        for (const block of this.chain) {
          for (const trans of block.transactions) {
            if (trans.fromAddress === address) {
              balance -= trans.amount;
            }
    
            if (trans.toAddress === address) {
              balance += trans.amount;
            }
          }
        }
        return balance;
    }
    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash ){
                return false;
            }
        }
        return true;
    }
}

let blockChain = new BlockChain();
blockChain.addBlock(new Block(1, "02/12/2022", {amount: 4}));
blockChain.addBlock(new Block(2, "02/12/2022", {amount: 10}));

console.log("Is Blockchain valid: " + blockChain.isChainValid());
console.log(JSON.stringify(blockChain,null,4));

let userBlockChain = new BlockChain();
userBlockChain.addBlock(new Block(1, "02/12/2022", {name: "Gizem", password: "12345"}));
userBlockChain.addBlock(new Block(1, "02/12/2022", {name: "Eda", password: "12345"}));

console.log("Is Blockchain valid: " + userBlockChain.isChainValid());
console.log(JSON.stringify(userBlockChain,null,4));

//blockChain.createTransaction("adres1","adres2",100);
//blockChain.createTransaction("adres2","adres3",50);
//console.log(JSON.stringify(blockChain,null,4));
