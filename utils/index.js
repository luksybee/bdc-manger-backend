const Vault = require("../models/vault_balance");
const Cashier_balance = require("../models/cashier_balance");
const Bank_balance = require("../models/bank_balance");

// ADD TO BANK

const addToBank = async (acct_no, currency, amount) => {

  try {
    const existingCurrency = await Bank_balance.findOne({acct_no});
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance + Number(amount),
      };
      const opts = { new: true, upsert: true };
    
      await Bank_balance.findOneAndUpdate(filter, update, opts);

    }
  } catch (error) {
    console.log(error);
  }
};

// DEDUCT FROM BANK

const deductFromBank = async (acct_no, currency, amount) => {
 
  try {
    const existingCurrency = await Bank_balance.findOne({acct_no});
    if (existingCurrency) {
      const filter = { _id: existingCurrency._id };
      const update = {
        balance: existingCurrency.balance - Number(amount),
      };
      const opts = { new: true, upsert: true };
    
      await Bank_balance.findOneAndUpdate(filter, update, opts);

    }
   
  } catch (error) {
    console.log(error);
  }
};

// ADD TO VAULT

const addToVault = async (currency, amount) => {
  try {
    const existingCurrency = await Vault.findOne({currency});
    if (existingCurrency) {
      await Vault.update({ currency },{$inc: {balance : +amount}}, {new:true, upsert:true})
    }else{
      let vault_ = new Vault();
      vault_.currency = currency;
      vault_.balance = +amount;
      await vault_.save();
    }
  } catch (error) {
    console.log(error);
  }
};

// DEDUCT FROM VAULT

const deductFromVault = async (currency, amount) => {
 
  try {
    await Vault.update({ currency },{$inc: {balance : -amount}}, {new:true, upsert:true})
  } catch (error) {
    console.log(error);
  }
};

// ADD TO CASHIER
const addToCashier = async (currency, amount) => {
  
  try {
    await Cashier_balance.update({ currency },{$inc: {balance : +amount}}, {new:true, upsert:true})
  } catch (error) {
    console.log(error);
  }
};

// DEDUCT FROM CASHIER
const deductFromCashier = async (currency, amount) => {
 
  try {
      await Cashier_balance.update({ currency },{$inc: {balance : -amount}}, {new:true, upsert:true})
    }
   
  catch (error) {
    console.log(error);
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
