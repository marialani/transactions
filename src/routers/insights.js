const express = require("express");
const router = express.Router();
const axios = require("axios");

const transactionsURL = "http://54.154.227.172:3000/transactions";

router.get("/categories", async (req, res, next) => {
  try {
    const transactions = await axios
      .get(transactionsURL)
      .then((response) => response.data);

    let categories = {};

    transactions.forEach((transaction) => {
      let currentCategory = transaction.category;
      if (!categories[currentCategory]) {
        categories[currentCategory] = {
          totalNumber: 0,
          totalValue: 0,
          averageValue: 0,
        };
      }
      categories[currentCategory].totalNumber += 1;
      categories[currentCategory].totalValue += transaction.amount;
      categories[currentCategory].averageValue =
        categories[currentCategory].totalValue /
        categories[currentCategory].totalNumber;
    });
    res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
});

router.get("/cashflow", async (req, res, next) => {
  try {
    const transactions = await axios
      .get(transactionsURL)
      .then((response) => response.data);

    const cashflow = {};

    transactions.forEach((transaction) => {
      let currentPaymentDate = transaction.paymentDate
        .split("T")[0]
        .split("-")
        .reverse()
        .join("/");
      if (!cashflow[currentPaymentDate]) {
        cashflow[currentPaymentDate] = {
          totalNumber: 0,
          totalValue: 0,
          averageValue: 0,
        };
      }
      cashflow[currentPaymentDate].totalNumber += 1;
      cashflow[currentPaymentDate].totalValue += transaction.amount;
      cashflow[currentPaymentDate].averageValue =
        cashflow[currentPaymentDate].totalValue /
        cashflow[currentPaymentDate].totalNumber;
    });
    res.status(200).json(cashflow);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
