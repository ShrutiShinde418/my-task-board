import request from "supertest";
import app from "../../src/index.js";
import { objectIdRegex, TestcaseHelper } from "../utility/testcaseHelper.js";

const helper = new TestcaseHelper();
let result;

describe("Integration testcases for board controller", function () {
  describe("Integration testcases for create board controller", function () {
    describe("Negative testcases for create board controller", function () {
      beforeAll(async () => {
        result = await helper.createUser();
        await helper.removeUser(result.userId);
      });

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
        assert.equal(response.body.error.message, "Something went wrong");
      });
    });

    describe("Positive testcases for create board controller", () => {
      beforeEach(async () => {
        result = await helper.createUser();
      });

      it("should create and fetch a board when valid user details are passed", async () => {
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

      afterEach(async () => {
        await helper.removeUser(result.userId);
      });
    });
  });

  describe("Integration testcases for get board controller", function () {
    describe("Negative testcases for get board controller", () => {
      beforeAll(async () => {
        result = await helper.createUser();
      });

      it("should fail to fetch a board that doesn't exist", async () => {
        const response = await request(app)
          .get("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 404);
        assert.equal(
          response.body.error.message,
          "The requested resource could not be located",
        );
      });

      it("should fail to fetch a board when the boardId passed is not a valid ObjectID", async () => {
        const response = await request(app)
          .get("/api/boards/FF125DF6E977404A9E8C600CDAFEFF5")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(response.body.error.message, "ObjectId passed is invalid");
      });

      it("should fail to fetch a board when the token passed is expired", async () => {
        const response = await request(app)
          .get("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set(
            "Cookie",
            `token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY5MjZmZDdiOTZjNzc3NjQwYTc3Y2JlYSIsImlhdCI6MTc2NDE2Mjk3NCwiZXhwIjoxNzY0MzM1Nzc0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMifQ.Ec2YGBFTiTxtaE6r_QI7ZGO8yh-4mWUAT6jDexEqKeI`,
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

      it("should fail to fetch a board when the token passed is of a user that doesn't exist", async () => {
        const newUser = await helper.createUser();

        await helper.removeUser(newUser.userId);

        const response = await request(app)
          .get("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${newUser.token}`);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.equal(response.body.error.code, 424);
        assert.equal(response.body.error.message, "Something went wrong");
        assert.notExists(response.body.error.name);
      });

      afterAll(async () => {
        await helper.removeUser(result.userId);
      });
    });

    describe("Positive testcases for get board controller", () => {
      beforeAll(async () => {
        result = await helper.createUser();
      });

      it("should fetch a board containing tasks successfully", async () => {
        const createBoardResponse = await request(app)
          .post("/api/boards")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(createBoardResponse.status, 200);
        assert.isNotEmpty(createBoardResponse.body);
        assert.equal(createBoardResponse.body.success, true);
        assert.exists(createBoardResponse.body.boardId);
        assert.isNotEmpty(createBoardResponse.body.boardId);
        assert.match(createBoardResponse.body.boardId, objectIdRegex);

        const { task } = await helper.createSingleRandomTaskHandler(
          createBoardResponse.body.boardId,
          result.token,
        );

        const getBoardResponse = await request(app)
          .get(`/api/boards/${createBoardResponse.body.boardId}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(getBoardResponse.status, 200);
        assert.isNotEmpty(getBoardResponse.body);
        assert.equal(getBoardResponse.body.success, true);
        assert.equal(
          getBoardResponse.body._id,
          createBoardResponse.body.boardId,
        );
        assert.equal(getBoardResponse.body.name, "My Task Board");
        assert.equal(
          getBoardResponse.body.description,
          "Tasks to keep organised",
        );
        assert.exists(getBoardResponse.body.tasks);
        assert.lengthOf(getBoardResponse.body.tasks, 1);
        assert.includeMembers(getBoardResponse.body.tasks, [task._id]);
        assert.exists(getBoardResponse.body.createdAt);
        assert.exists(getBoardResponse.body.updatedAt);
      });

      it("should fetch a board containing multiple tasks successfully", async () => {
        const createBoardResponse = await request(app)
          .post("/api/boards")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(createBoardResponse.status, 200);
        assert.isNotEmpty(createBoardResponse.body);
        assert.equal(createBoardResponse.body.success, true);
        assert.exists(createBoardResponse.body.boardId);
        assert.isNotEmpty(createBoardResponse.body.boardId);
        assert.match(createBoardResponse.body.boardId, objectIdRegex);

        const { taskIdsArray } = await helper.createNTasksHandler(
          createBoardResponse.body.boardId,
          result.token,
          4,
        );

        const getBoardResponse = await request(app)
          .get(`/api/boards/${createBoardResponse.body.boardId}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(getBoardResponse.status, 200);
        assert.isNotEmpty(getBoardResponse.body);
        assert.equal(getBoardResponse.body.success, true);
        assert.equal(
          getBoardResponse.body._id,
          createBoardResponse.body.boardId,
        );
        assert.equal(getBoardResponse.body.name, "My Task Board");
        assert.equal(
          getBoardResponse.body.description,
          "Tasks to keep organised",
        );
        assert.exists(getBoardResponse.body.tasks);
        assert.lengthOf(getBoardResponse.body.tasks, 4);
        assert.includeMembers(getBoardResponse.body.tasks, taskIdsArray);
        assert.exists(getBoardResponse.body.createdAt);
        assert.exists(getBoardResponse.body.updatedAt);
      });

      afterAll(async () => {
        await helper.removeUser(result.userId);
      });
    });
  });

  describe("Integration testcases for update board controller", () => {
    beforeAll(async () => {
      result = await helper.createUserWithBoard();
    });

    describe("Negative testcases for update board controller", () => {
      it("should fail to update a board when the request body contains invalid JSON", async () => {
        const requestBody = {
          name: "Ta",
        };

        const response = await request(app)
          .put("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody + "fsdfjsdkf");

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

      it("should fail to update a board that doesn't exist", async () => {
        const requestBody = {
          name: "My New Task Board",
        };

        const response = await request(app)
          .put("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 404);
        assert.equal(
          response.body.error.message,
          "The requested resource could not be located",
        );
      });

      it("should fail to update a board when the token passed is expired", async () => {
        const response = await request(app)
          .put("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set(
            "Cookie",
            `token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY5MjZmZDdiOTZjNzc3NjQwYTc3Y2JlYSIsImlhdCI6MTc2NDE2Mjk3NCwiZXhwIjoxNzY0MzM1Nzc0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMifQ.Ec2YGBFTiTxtaE6r_QI7ZGO8yh-4mWUAT6jDexEqKeI`,
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

      it("should fail to update a board when the token passed is of a user that doesn't exist", async () => {
        const newUser = await helper.createUserWithBoard();

        await helper.removeUser(newUser.userId);

        const requestBody = {
          name: "My New Task Board",
        };

        const response = await request(app)
          .put(`/api/boards/${newUser.boardId}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${newUser.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 424);
        assert.equal(response.body.error.message, "Something went wrong");
      });

      it("should fail to update a board when the boardId passed is not a valid ObjectID", async () => {
        const response = await request(app)
          .put("/api/boards/FF125DF6E977404A9E8C600CDAFEFF5")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(response.body.error.message, "ObjectId passed is invalid");
      });

      it("should fail to update a board when the name of the task board passed is less than 5 characters", async () => {
        const requestBody = {
          name: "Ta",
        };

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
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
          "Board name should have at least 5 characters",
        );
      });

      it("should fail to update a board when the description of the task board passed is less than 5 characters", async () => {
        const requestBody = {
          name: "Things to Do ASAP",
          description: "pp",
        };

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
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
          "Description should have at least 5 characters",
        );
      });

      it("should fail to update a board when an unknown parameter is passed in the request", async () => {
        const requestBody = {
          name: "Things to Do ASAP",
          description: "Development tasks to be done by the next sprint",
          unknown: "fdkjsdkfdks",
        };

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
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
          "The request includes unsupported or unrecognized parameter(s).",
        );
      });

      it("should fail to update a board when an empty request body is passed", async () => {
        const requestBody = {};

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
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
          "At least one key (name, description) must be present.",
        );
      });

      it("should fail to update a board when the name is passed as null", async () => {
        const requestBody = {
          name: null,
          description: "Development tasks to be done by the next sprint",
        };

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
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

      it("should fail to update a board when the description is passed as an empty string", async () => {
        const requestBody = {
          name: "Courses to Complete",
          description: "",
        };

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
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
          "Description should have at least 5 characters",
        );
      });
    });

    describe("Positive testcases for update board controller", () => {
      it("should successfully update a board when a valid request is passed", async () => {
        const requestBody = {
          name: "Things to Do ASAP",
          description: "Development tasks to be done by the next sprint",
        };

        const response = await request(app)
          .put(`/api/boards/${result.boardId}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 200);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, true);
        assert.equal(response.body.name, requestBody.name);
        assert.equal(response.body.description, requestBody.description);
      });
    });

    afterAll(async () => {
      await helper.removeUser(result.userId);
    });
  });

  describe("Integration testcases for remove board controller", () => {
    describe("Negative testcases for remove board controller", () => {
      beforeAll(async () => {
        result = await helper.createUserWithBoard();
      });

      it("should fail to remove a board that doesn't exist", async () => {
        const response = await request(app)
          .delete("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 404);
        assert.equal(
          response.body.error.message,
          "The requested resource could not be located",
        );
      });

      it("should fail to remove a board when the token passed is expired", async () => {
        const response = await request(app)
          .delete("/api/boards/6566d5b0c9a0b1c2d3e4f5a6")
          .set("Content-Type", "application/json")
          .set(
            "Cookie",
            `token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY5MjZmZDdiOTZjNzc3NjQwYTc3Y2JlYSIsImlhdCI6MTc2NDE2Mjk3NCwiZXhwIjoxNzY0MzM1Nzc0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMifQ.Ec2YGBFTiTxtaE6r_QI7ZGO8yh-4mWUAT6jDexEqKeI`,
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

      it("should fail to update a board when the boardId passed is not a valid ObjectID", async () => {
        const response = await request(app)
          .delete("/api/boards/FF125DF6E977404A9E8C600CDAFEFF5")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 400);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, false);
        assert.isNotEmpty(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(response.body.error.message, "ObjectId passed is invalid");
      });

      afterAll(async () => {
        await helper.removeUser(result.userId);
      });
    });

    describe("Positive testcases for remove board controller", () => {
      it("should successfully remove a board with tasks in it", async () => {
        const result = await helper.createUserWithBoard();
        await helper.createNTasksHandler(result.boardId, result.token, 3);

        const response = await request(app)
          .delete(`/api/boards/${result.boardId}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 200);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, true);
        assert.exists(response.body.message);
        assert.equal(
          response.body.message,
          `Board with ID ${result.boardId} deleted successfully with 3 task(s).`,
        );

        await helper.removeUser(result.userId);
      });

      it("should successfully remove a board when a user has multiple boards", async () => {
        const result = await helper.createMBoardsAndNTasksHandler(3, 2);

        const response = await request(app)
          .delete(`/api/boards/${result.boardIdsArray[1]}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(response.status, 200);
        assert.isNotEmpty(response.body);
        assert.equal(response.body.success, true);
        assert.exists(response.body.message);
        assert.equal(
          response.body.message,
          `Board with ID ${result.boardIdsArray[1]} deleted successfully with 2 task(s).`,
        );

        const userDetailsResponse = await request(app)
          .get("/api/get/user/details")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`);

        assert.equal(userDetailsResponse.status, 200);
        assert.isNotEmpty(userDetailsResponse.body);
        assert.equal(userDetailsResponse.body.success, true);
        assert.exists(userDetailsResponse.body.boards);
        assert.isArray(userDetailsResponse.body.boards);
        assert.lengthOf(userDetailsResponse.body.boards, 3);
        const boardIds = userDetailsResponse.body.boards.map(
          (board) => board._id,
        );
        assert.includeMembers(
          boardIds,
          result.boardIdsArray.filter(
            (boardId) => boardId !== result.boardIdsArray[1],
          ),
        );
        assert.exists(userDetailsResponse.body.message);
        assert.equal(
          userDetailsResponse.body.message,
          `User Details with id ${result.userId} logged in successfully`,
        );

        await helper.removeUser(result.userId);
      });
    });
  });
});
