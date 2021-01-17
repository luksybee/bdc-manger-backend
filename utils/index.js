const Vault = require("../models/vault_balance");
const Cashier_balance = require("../models/cashier_balance");
const Bank_balance = require("../models/bank_balance");
const { result } = require("lodash");
/*
ADD TO BANK
-Takes three params (bank_id, currency, amount)
-- fetch bank using bank id and currency type
-- add amount to bank
*/

const addToBank = async (acct_no, currency, amount) => {
  // let balance;
  // try {
  //   const result = Cashier_balance.findOneAndUpdate({currency: currency, bank: bank_id}, {balance:balance+amount}, {new:true})
  //   console.log(result);
  // } catch (error) {}

  try {
    console.log("starting",acct_no);
    const existingCurrency = await Bank_balance.findOne({acct_no:acct_no});
    console.log("record",existingCurrency);
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance + amount,
      };
      const opts = { new: true, upsert: true };
    
      const data = await Bank_balance.findOneAndUpdate(filter, update, opts);

      return data
      // res.send(data)
    }
    // else{

    //   let vault_ = new Vault();
    //   vault_.currency = currency;
    //   vault_.balance = amount;
    //   const data = await vault_.save();
    //   return data
    //   // res.send(v);
    // }
  } catch (error) {
    console.log(error);
  }
};
/*
DEDUCT FROM BANK
-Takes three params (bank_id, currency, amount)
-- fetch bank using bank id and currency type
-- deduct amount from bank
*/
const deductFromBank = async (acct_no, currency, amount) => {
  // try {
  //   const result = Cashier_balance.findOneAndUpdate({currency: currency, bank: bank_id}, {balance:balance-amount}, {new:true})
  //   console.log(result);
  // } catch (error) {}
  try {
    const existingCurrency = await Bank_balance.findOne({acct_no:acct_no});
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance - amount,
      };
      const opts = { new: true, upsert: true };
    
      const data = await Bank_balance.findOneAndUpdate(filter, update, opts);

      return data
      // res.send(data)
    }
    // else{

    //   let vault_ = new Vault();
    //   vault_.currency = currency;
    //   vault_.balance = amount;
    //   const data = await vault_.save();
    //   return data
    //   // res.send(v);
    // }
  } catch (error) {
    console.log(error);
  }
};
/*
ADD TO VAULT
-Takes two params (currency, amount)
-- fetch using currency type
-- add amount
*/

const addToVault = async (currency, amount) => {
  try {
    const existingCurrency = await Vault.findOne({currency});
    console.log(existingCurrency);
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance + amount,
      };
      const opts = { new: true, upsert: true };
    
      const data = await Vault.findOneAndUpdate(filter, update, opts);

      return data
      // res.send(data)
    }else{

      let vault_ = new Vault();
      vault_.currency = currency;
      vault_.balance = amount;
      const data = await vault_.save();
      return data
      // res.send(v);
    }
  } catch (error) {
    // next(err)
  }
};
/*
DEDUCT FROM VAULT
-Takes two params (currency, amount)
-- fetch using currency type
-- deduct amount
*/

const deductFromVault = async (currency, amount) => {
  // try {
  //   const result = Vault_balance.findOneAndUpdate({currency: currency}, {balance: balance-amount},{new:true})
  //   console.log(result);
  // } catch (error) {}

  try {
    const existingCurrency = await Vault.findOne({currency});
    console.log(existingCurrency);
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance - amount,
      };
      const opts = { new: true, upsert: true };
    
      const data = await Vault.findOneAndUpdate(filter, update, opts);

      return data
      // res.send(data)
    }
    // else{

    //   let vault_ = new Vault();
    //   vault_.currency = currency;
    //   vault_.balance = amount;
    //   const data = await vault_.save();
    //   return data
    //   // res.send(v);
    // }
  } catch (error) {
    // next(err)
  }
};
/*
ADD TO CASHIER
-Takes two params (currency, amount)
-- fetch using currency type
-- add amount
*/
const addToCashier = async (currency, amount) => {
  // try {
  //   const result = Cashier_balance.findOneAndUpdate({currency:currency}, {balance:balance+amount}, {new:true, upsert: true})
  //   console.log(result);
  // } catch (error) {}

  try {
    const existingCurrency = await Cashier_balance.findOne({currency});
    console.log(existingCurrency);
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance + amount,
      };
      const opts = { new: true, upsert: true };
    
      const data = await Cashier_balance.findOneAndUpdate(filter, update, opts);

      return data
      // res.send(data)
    }else{

      let cashier = new Cashier_balance();
      cashier.currency = currency;
      cashier.balance = amount;
      const data = await cashier.save();
      return data
      // res.send(v);
    }
  } catch (error) {
    // next(err)
  }
};
/*
DEDUCT FROM CASHIER
-Takes two params (currency, amount)
-- fetch using currency type
-- deduct amount
*/
const deductFromCashier = async (currency, amount) => {
  //  try {
  //    console.log("calling", currency, amount);
  //   const result = Cashier_balance.findOneAndUpdate({currency:currency}, {balance:balance-amount}, {new:true})
  //   console.log("deductFromCashier",result);
  //   return result
  // } catch (error) {}

  try {
    const existingCurrency = await Cashier_balance.findOne({currency});
    console.log(existingCurrency);
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance - amount,
      };
      const opts = { new: true, upsert: true };
    
      const data = await Cashier_balance.findOneAndUpdate(filter, update, opts);

      return data
      // res.send(data)
    }
    // else{

    //   let cashier = new Cashier_balance();
    //   cashier.currency = currency;
    //   cashier.balance = amount;
    //   const data = await cashier.save();
    //   return data
    //   // res.send(v);
    // }
  } catch (error) {
    // next(err)
  }
};

module.exports = {
  addToBank,
  addToCashier,
  addToVault,
  deductFromBank,
  deductFromCashier,
  deductFromVault,
};
