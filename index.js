const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const logger = require("morgan");
const path = require("path");
// const webpack = require("webpack");

const config = require("./config");
const passportJWT = require("./middlewares/passportJWT")();
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/bank");
const currencyRoutes = require("./routes/currency");
const customer_accountRoutes = require("./routes/customer_account");
const customer_transcRoutes = require("./routes/customer_transc");
const customerRoutes = require("./routes/customer");
const transc_givenRoutes = require("./routes/transc_given");
const transc_recievedRoutes = require("./routes/transc_recieved");
const lodgementRoutes = require("./routes/lodgement");
const inflowRoutes = require("./routes/inflow");
const outflowRoutes = require("./routes/outflow");
const expenseRoutes = require("./routes/expense");
const accountRoutes = require("./routes/account");
const vaultRoutes = require("./routes/vault");
const cashierRoutes = require("./routes/cashier");


app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportJWT.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/customer_account", customer_accountRoutes);
app.use("/api/transaction", customer_transcRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/given", transc_givenRoutes);
app.use("/api/recieved", transc_recievedRoutes);
app.use("/api/lodgement", lodgementRoutes);
app.use("/api/inflow", inflowRoutes);
app.use("/api/outflow", outflowRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/cashier", cashierRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log("Listening...");
  console.log("Database_URL", process.env.mongoURI);
});
