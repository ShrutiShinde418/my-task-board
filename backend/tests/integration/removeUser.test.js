import request from "supertest";
import app from "../../src/index.js";

describe("Integration testcases for removeUser controller", () => {
  describe("Negative testcases for removeUser controller", () => {
    it("should fail to remove a user when an invalid objectID is passed", async () => {
      const response = await request(app).post(
        "/api/remove/user/FF125DF6E977404A9E8C600CDAFEFF5",
      );

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(response.body.error.message, "ObjectId passed is invalid");
      assert.notExists(response.body.error.name);
    });

    it("should fail to remove a user that doesn't exists", async () => {
      const response = await request(app).post(
        "/api/remove/user/691f5a4190d8a5723c505bf8",
      );

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 424);
      assert.equal(response.body.error.message, "Something went wrong");
      assert.notExists(response.body.error.name);
    });
  });
});
