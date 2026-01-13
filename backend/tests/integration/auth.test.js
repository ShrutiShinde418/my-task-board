import request from "supertest";
import app from "../../src/index.js";
import { objectIdRegex, TestcaseHelper } from "../utility/testcaseHelper.js";

const helper = new TestcaseHelper();
let result;

describe("Integration testcases for updateLastVisitedBoardController", function () {
  describe("Negative testcases for updateLastVisitedBoardController", function () {
    beforeAll(async () => {
      result = await helper.createUser();
    });

    it("should fail to update last visited board when the request body is empty", async () => {
      const requestBody = {};

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.notExists(response.body.error.name);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Invalid input: expected string, received undefined",
      );
    });

    it("should fail to update the last visited board when the request body contains invalid JSON", async () => {
      const requestBody = {
        boardId: "69595fd15f5537eae419ba50",
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody + "sdfjdkjfd");

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Request Body contains invalid JSON",
      );
      assert.notExists(response.body.error.name);
    });

    it("should fail to update the last visited board when the token is not passed", async () => {
      const requestBody = {
        boardId: "69595fd15f5537eae419ba50",
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 401);
      assert.isNotNull(response.body);
      assert.equal(response.body.success, false);
      assert.exists(response.body.error);
      assert.notExists(response.body.error.name);
      assert.equal(response.body.error.code, 401);
      assert.equal(response.body.error.message, "Authentication failed");
    });

    it("should fail to update the last visited board when the token passed is expired", async () => {
      const requestBody = {
        boardId: "69595fd15f5537eae419ba50",
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set(
          "Cookie",
          `token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY5MjZmZDdiOTZjNzc3NjQwYTc3Y2JlYSIsImlhdCI6MTc2NDE2Mjk3NCwiZXhwIjoxNzY0MzM1Nzc0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMifQ.Ec2YGBFTiTxtaE6r_QI7ZGO8yh-4mWUAT6jDexEqKeI`,
        )
        .send(requestBody);

      assert.equal(response.status, 401);
      assert.isNotNull(response.body);
      assert.equal(response.body.success, false);
      assert.exists(response.body.error);
      assert.notExists(response.body.error.name);
      assert.equal(response.body.error.code, 401);
      assert.equal(
        response.body.error.message,
        "The authentication token has expired",
      );
    });

    it("should fail to update the last visited board when the boardId is passed as an object", async () => {
      const requestBody = {
        boardId: {},
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.notExists(response.body.error.name);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Invalid input: expected string, received object",
      );
    });

    it("should fail to update the last visited board when the boardId is passed as null", async () => {
      const requestBody = {
        boardId: null,
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.notExists(response.body.error.name);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Invalid input: expected string, received null",
      );
    });

    it("should fail to update the last visited board when an invalid ObjectID is passed as the boardId", async () => {
      const requestBody = {
        boardId: "FF125DF6E977404A9E8C600CDAFEFF5",
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(response.body.error.message, "ObjectId passed is invalid");
      assert.notExists(response.body.error.name);
    });

    it("should fail to update the last visited board when the boardId of the particular board does not exist", async () => {
      const requestBody = {
        boardId: "69595fd15f5537eae419ba50",
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 404);
      assert.equal(
        response.body.error.message,
        "The requested resource could not be located",
      );
      assert.notExists(response.body.error.name);
    });

    afterAll(async () => {
      await helper.removeUser(result.userId);
    });
  });

  describe("Positive testcases for updateLastVisitedBoardController", function () {
    beforeAll(async () => {
      result = await helper.createUser();
    });

    it("should successfully update the last visited board when a valid boardId is passed", async () => {
      const { boardId } = await helper.createBoard(result.token);

      const requestBody = {
        boardId,
      };

      const response = await request(app)
        .post("/api/update/user")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${result.token}`)
        .send(requestBody);

      assert.equal(response.status, 200);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, true);
      assert.exists(response.body.message);
      assert.equal(
        response.body.message,
        `Last Visited Board updated to ${boardId} successfully`,
      );
    });

    afterAll(async () => {
      await helper.removeUser(result.userId);
    });
  });
});
