import request from "supertest";
import app from "../../src/index.js";
import { objectIdRegex, TestcaseHelper } from "../utility/testcaseHelper.js";

const helper = new TestcaseHelper();
let result;

describe("Integration testcases for board controller", function () {
  describe("Integration testcases for create board controller", function () {
    describe("Negative testcases for create board controller", function () {
      it("should fail to create a board when no token is passed in the headers", async () => {
        const response = await request(app)
          .post("/api/boards")
          .set("Content-Type", "application/json");

        assert.equal(response.status, 401);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 401);
        assert.equal(response.body.error.message, "Authentication failed");
      });

      it("should fail to create a board when the token is passed in the headers as a cookie but its expired", async () => {
        const response = await request(app)
          .post("/api/boards")
          .set("Content-Type", "application/json")
          .set(
            "Cookie",
            "token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY5MjZmZDdiOTZjNzc3NjQwYTc3Y2JlYSIsImlhdCI6MTc2NDE2Mjk3NCwiZXhwIjoxNzY0MzM1Nzc0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMifQ.Ec2YGBFTiTxtaE6r_QI7ZGO8yh-4mWUAT6jDexEqKeI",
          );

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

      beforeAll(async () => {
        result = await helper.createUser();
        await helper.removeUser(result.userId);
      });

      it("should fail to create a board when the token passed in the headers is of a user that doesn't exist", async () => {
        const response = await request(app)
          .post("/api/boards")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 424);
        assert.equal(response.body.error.message, "User doesn't exist");
      });
    });

    describe("Positive testcases for create board controller", () => {
      beforeEach(async () => {
        result = await helper.createUser();
      });

      afterEach(async () => {
        await helper.removeUser(result.userId);
      });

      it("should create a board when valid user details are passed", async () => {
        const response = await request(app)
          .post("/api/boards")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 200);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, true);
        assert.exists(response.body.boardId);
        assert.isNotEmpty(response.body.boardId);
        assert.match(response.body.boardId, objectIdRegex);

        const getBoardResponse = await request(app)
          .get(`/api/boards/${response.body.boardId}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(getBoardResponse.status, 200);
        assert.isNotEmpty(getBoardResponse.body);
        assert.equal(getBoardResponse.body.success, true);
        assert.match(getBoardResponse.body._id, objectIdRegex);
        assert.equal(getBoardResponse.body.name, "My Task Board");
        assert.equal(
          getBoardResponse.body.description,
          "Tasks to keep organised",
        );
        assert.isArray(getBoardResponse.body.tasks);
        assert.lengthOf(getBoardResponse.body.tasks, 0);
        assert.exists(getBoardResponse.body.createdAt);
        assert.exists(getBoardResponse.body.updatedAt);
      });
    });
  });
});
