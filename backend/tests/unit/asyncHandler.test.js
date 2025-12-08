import { asyncHandler } from "../../src/middlewares/asyncHandler.js";

describe("Unit tests for asyncHandler", () => {
  describe("Positive testcases for asyncHandler", () => {
    it("should call next when the promise resolves", async () => {
      const mockReq = {
        path: "/api/boards",
      };

      const mockRes = {
        send: vi.fn(),
      };

      const mockNext = vi.fn();

      const fn = async () => "Success";

      const handler = asyncHandler(fn);

      await handler(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("Negative testcases for asyncHandler", () => {
    it("should call errors and pass them to next", async () => {
      const mockReq = {
        path: "/api/boards",
      };

      const mockRes = {
        send: vi.fn(),
      };

      const mockNext = vi.fn();

      const fn = async () => {
        throw new Error("Test error");
      };

      const handler = asyncHandler(fn);

      await handler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
