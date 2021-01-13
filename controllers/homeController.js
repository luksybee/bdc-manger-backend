const validationHandler = require("../validations/validationHandler");
const path = require("path");

// app.use(express.static(path.join(__dirname, "public")));

exports.index = async (req, res) => {
  try {
    res.send(path.join(__dirname + "/public/index.html")); //serves index.html when home route is hit
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res) => {
  try {
    const bank = await Bank.findOne(req.params.id);

    res.send(bank);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    validationHandler(req);

    let bank = new Bank();
    bank.name = req.body.name;
    bank = await bank.save();

    res.send(bank);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let bank = await Bank.findById(req.params.id);
    // Check if bank

    bank = await bank.save();

    res.send(bank);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let bank = await Post.findById(req.params.id);

    await bank.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};
