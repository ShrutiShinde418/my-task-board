import { describe, it, expect, vi } from "vitest";
import startTransaction, { getTransactionIdFromAsyncStore, getTxnStartFromAsyncStore } from "../../src/middlewares/startTransaction.js";

let capturedTxnId, capturedTxnStart;

describe("Unit tests for startTransaction", () => {
  it("should call next when startTransaction is called", () => {
    const mockReq = {
      path: "/api/boards",
    };

    const mockRes = {
      send: vi.fn(),
    };

    const mockNext = vi.fn(() => {
      capturedTxnId = getTransactionIdFromAsyncStore();
      capturedTxnStart = getTxnStartFromAsyncStore();
    });

    startTransaction(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(typeof capturedTxnId).toBe("string");
    expect(capturedTxnId).toBeTruthy();
    expect(typeof capturedTxnStart).toBe("number");

  });
});
