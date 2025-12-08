import request from "supertest";
import randomString from "randomstring";
import app from "../../src/index.js";
import { objectIdRegex, TestcaseHelper } from "../utility/testcaseHelper.js";

const helper = new TestcaseHelper();
let result;

describe("Integration testcases for tasks controller", function () {
  describe("Integration testcases for createTaskController", function () {
    describe("Negative testcases for createTaskController", function () {
      beforeAll(async () => {
        result = await helper.createUserWithBoard();
      });

      it("should fail to create a task when request body passed is empty", async () => {
        const requestBody = {};

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Invalid input: expected string, received undefined, Invalid input: expected string, received undefined",
        );
      });

      it("should fail to create a task when request body contains invalid JSON", async () => {
        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: "6934806d5785f87b8cf40225",
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody + "fsdklsdcd");

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Request Body contains invalid JSON",
        );
      });

      it("should fail to create a task when cookie containing the token is not passed", async () => {
        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: "6934806d5785f87b8cf40225",
        };

        const response = await request(app)
          .post("/api/tasks/create")
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

      it("should fail to create a task when cookie containing the token is expired", async () => {
        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: "6934806d5785f87b8cf40225",
        };

        const response = await request(app)
          .post("/api/tasks/create")
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

      it("should fail to create a task when cookie containing the token is of a user that doesn't exist", async () => {
        const newUser = await helper.createUserWithBoard();

        await helper.removeUser(newUser.userId);

        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: newUser.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${newUser.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 424);
        assert.equal(response.body.error.message, "User doesn't exist");
      });

      it("should fail to create a task when the task name has less than 5 characters", async () => {
        const requestBody = {
          name: "svo",
          description: "dmvkdmfvdfmf",
          boardId: result.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Task should have at least 5 characters",
        );
      });

      it("should fail to create a task when the task description has less than 5 characters", async () => {
        const requestBody = {
          name: "svosdffserrcrecwecee",
          description: "dmv",
          boardId: result.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Description should have at least 5 characters",
        );
      });

      it("should fail to create a task when the board ID is not provided", async () => {
        const requestBody = {
          name: "svosdffserrcrecwecee",
          description: "dmvvfdvfvfvdvsvdff",
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Invalid input: expected string, received undefined",
        );
      });

      it("should fail to create a task when the board ID provided doesn't exist", async () => {
        const requestBody = {
          name: "svosdffserrcrecwecee",
          description: "dmvvfdvfvdfvdfvsfvssfvf",
          boardId: "693489108f88775aa3f275eb",
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 404);
        assert.equal(
          response.body.error.message,
          "The requested resource could not be located",
        );
      });

      it("should fail to create a task when the board ID provided is an invalid ObjectID", async () => {
        const requestBody = {
          name: "svosdffserrcrecwecee",
          description: "dmvsvsvffvffvf",
          boardId: "693489108f88775aa3f275ebfff",
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(response.body.error.message, "ObjectId passed is invalid");
      });

      it("should fail to create a task when the request body contains unknown parameters", async () => {
        const requestBody = {
          name: "svosdffserrcrecwecee",
          description: "dmvsvsvffvffvf",
          boardId: result.boardId,
          unknown: "dfnsdksmfd",
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "The request includes unsupported or unrecognized parameter(s).",
        );
      });

      it("should fail to create a task when the name parameter is passed as an object", async () => {
        const requestBody = {
          name: {},
          description: "dmvsvsvffvffvf",
          boardId: result.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Invalid input: expected string, received object",
        );
      });

      it("should fail to create a task when invalid status is passed", async () => {
        const requestBody = {
          name: "svosdffserrcrecwecee",
          description: "dmvsvsvffvffvf",
          boardId: result.boardId,
          status: "sdkfsdkfdkf",
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          'Invalid option: expected one of "inProgress"|"completed"|"wontDo"|"toDo"',
        );
      });

      afterAll(async () => {
        await helper.removeUser(result.userId);
      });
    });

    describe("Positive testcases for createTaskController controller", () => {
      beforeAll(async () => {
        result = await helper.createUserWithBoard();
      });

      it("should create a task successfully when valid parameters are passed", async () => {
        const requestBody = {
          name: randomString.generate({
            length: 12,
            charset: "alphabetic",
          }),
          description: randomString.generate({
            length: 30,
            charset: "alphabetic",
          }),
          boardId: result.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 200);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, true);
        assert.exists(response.body.task._id);
        assert.equal(response.body.task.name, requestBody.name);
        assert.equal(response.body.task.description, requestBody.description);
        assert.equal(response.body.task.status, "toDo");
        assert.match(response.body.task._id, objectIdRegex);
      });

      it("should create a task successfully with a status of wontDo", async () => {
        const requestBody = {
          name: randomString.generate({
            length: 12,
            charset: "alphabetic",
          }),
          description: randomString.generate({
            length: 30,
            charset: "alphabetic",
          }),
          status: "wontDo",
          boardId: result.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 200);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, true);
        assert.exists(response.body.task._id);
        assert.equal(response.body.task.name, requestBody.name);
        assert.equal(response.body.task.description, requestBody.description);
        assert.equal(response.body.task.status, requestBody.status);
        assert.match(response.body.task._id, objectIdRegex);
      });

      it("should create a task successfully with a status of completed", async () => {
        const requestBody = {
          name: randomString.generate({
            length: 12,
            charset: "alphabetic",
          }),
          description: randomString.generate({
            length: 30,
            charset: "alphabetic",
          }),
          status: "completed",
          boardId: result.boardId,
        };

        const response = await request(app)
          .post("/api/tasks/create")
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 200);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, true);
        assert.exists(response.body.task._id);
        assert.equal(response.body.task.name, requestBody.name);
        assert.equal(response.body.task.description, requestBody.description);
        assert.equal(response.body.task.status, requestBody.status);
        assert.match(response.body.task._id, objectIdRegex);
      });

      afterAll(async () => {
        await helper.removeUser(result.userId);
      });
    });
  });

  describe("Integration testcases for updateTaskController", () => {
    describe("Negative testcases for updateTaskController", () => {
      beforeAll(async () => {
        result = await helper.createUserWithBoard();

        const { task } = await helper.createSingleRandomTaskHandler(
          result.boardId,
          result.token,
        );

        result = { ...result, task };
      });

      it("should fail to update a task when request body passed is empty", async () => {
        const requestBody = {};

        const response = await request(app)
          .put(`/api/tasks/${result.task._id}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Invalid input: expected string, received undefined, Invalid input: expected string, received undefined",
        );
      });

      it("should fail to update a task when request body contains invalid JSON", async () => {
        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: "6934806d5785f87b8cf40225",
        };

        const response = await request(app)
          .put(`/api/tasks/${result.task._id}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${result.token}`)
          .send(requestBody + "fsdklsdcd");

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 422);
        assert.equal(
          response.body.error.message,
          "Request Body contains invalid JSON",
        );
      });

      it("should fail to update a task when cookie containing the token is not passed", async () => {
        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: "6934806d5785f87b8cf40225",
        };

        const response = await request(app)
          .put(`/api/tasks/${result.task._id}`)
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

      it("should fail to update a task when cookie containing the token is expired", async () => {
        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: "6934806d5785f87b8cf40225",
        };

        const response = await request(app)
          .put(`/api/tasks/${result.task._id}`)
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

      it("should fail to update a task when cookie containing the token is of a user that doesn't exist", async () => {
        const newUser = await helper.createUserWithBoard();

        await helper.removeUser(newUser.userId);

        const requestBody = {
          name: "svojsfvspvksvpkvkf",
          description: "dmvkdmfvdfmf",
          boardId: newUser.boardId,
        };

        const response = await request(app)
          .put(`/api/tasks/${result.task._id}`)
          .set("Content-Type", "application/json")
          .set("Cookie", `token=${newUser.token}`)
          .send(requestBody);

        assert.equal(response.status, 400);
        assert.isNotNull(response.body);
        assert.equal(response.body.success, false);
        assert.exists(response.body.error);
        assert.notExists(response.body.error.name);
        assert.equal(response.body.error.code, 424);
        assert.equal(response.body.error.message, "User doesn't exist");
      });

      afterAll(async () => {
        await helper.removeUser(result.userId);
      });
    });
  });
});
