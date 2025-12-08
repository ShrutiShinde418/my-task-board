import startTransaction from "../../src/middlewares/startTransaction.js";

describe("Unit tests for startTransaction", () => {
  it("should call next when startTransaction is called", () => {
    const mockReq = {
      path: "/api/boards",
    };

    const mockRes = {
      send: vi.fn(),
    };

    const mockNext = vi.fn();

    startTransaction(mockReq, mockRes, mockNext);

    expect(mockReq).toHaveProperty("transactionID");
    expect(mockReq).toHaveProperty("txnStart");
    expect(mockNext).toHaveBeenCalled();
  });
});
