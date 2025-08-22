import { v4 } from "uuid";

const startTransaction = (req, res, next) => {
  const transactionID = v4();

  req.transactionID = transactionID;
  req.txnStart = Date.now();

  next();
};

export default startTransaction;
