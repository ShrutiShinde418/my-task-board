import request from "supertest";
import randomString from "randomstring";
import { assert } from "vitest";
import app from "../../src/index.js";

export const objectIdRegex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export class TestcaseHelper {
  async createUser() {
    const requestBody = {
      email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
      password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
    };

    const response = await request(app)
      .post("/api/signup")
      .set("Content-Type", "application/json")
      .send(requestBody);

    assert.equal(response.status, 200);
    assert.isNotEmpty(response.body);
    assert.equal(response.body.success, true);
    assert.match(
      response.body.message,
      /User successfully created with ObjectID/,
    );

    const arr = response.body.message.split(" ");
    const userId = arr[arr.length - 4];

    const loginResponse = await request(app)
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send(requestBody);

    assert.equal(loginResponse.status, 200);
    assert.isNotEmpty(loginResponse.body);
    assert.equal(loginResponse.body.success, true);
    assert.equal(
      loginResponse.body.message,
      `User with id ${userId} logged in successfully`,
    );
    assert.isNotEmpty(loginResponse.headers["set-cookie"]);
    assert.include(loginResponse.headers["set-cookie"][0], "token");
    assert.include(loginResponse.headers["set-cookie"][0], "HttpOnly;");
    assert.include(loginResponse.headers["set-cookie"][0], "SameSite=Strict");

    return {
      email: requestBody.email,
      password: requestBody.password,
      token: loginResponse.headers["set-cookie"][0].split(";")[0].split("=")[1],
      userId,
      boards: loginResponse.body.boards,
    };
  }

  async removeUser(userId) {
    const removeUserResponse = await request(app)
      .post(`/api/remove/user/${userId}`)
      .set("Content-Type", "application/json");

    assert.equal(removeUserResponse.status, 200);
    assert.isNotEmpty(removeUserResponse.body);
    assert.equal(removeUserResponse.body.success, true);

    return { userId };
  }

  async createBoard(token) {
    const createBoardResponse = await request(app)
      .post("/api/boards")
      .set("Content-Type", "application/json")
      .set("Cookie", `token=${token}`);

    assert.equal(createBoardResponse.status, 200);
    assert.isNotEmpty(createBoardResponse.body);
    assert.equal(createBoardResponse.body.success, true);
    assert.exists(createBoardResponse.body.boardId);
    assert.isNotEmpty(createBoardResponse.body.boardId);
    assert.match(createBoardResponse.body.boardId, objectIdRegex);

    return { boardId: createBoardResponse.body.boardId };
  }

  async createSingleRandomTaskHandler(boardId, token) {
    const requestBody = {
      boardId,
      name: randomString.generate({
        length: 12,
        charset: "alphabetic",
      }),
      description: randomString.generate({
        length: 30,
        charset: "alphabetic",
      }),
    };
    const createTaskResponse = await request(app)
      .post("/api/tasks/create")
      .set("Content-Type", "application/json")
      .set("Cookie", `token=${token}`)
      .send(requestBody);

    assert.equal(createTaskResponse.status, 200);
    assert.isNotEmpty(createTaskResponse.body);
    assert.equal(createTaskResponse.body.success, true);
    assert.property(createTaskResponse.body, "task");

    return {
      task: createTaskResponse.body.task,
      boardId,
      token,
    };
  }

  async createNTasksHandler(boardId, token, noOfTasks) {
    const taskIdsArray = [];

    for (let i = 0; i < noOfTasks; i++) {
      const requestBody = {
        boardId,
        name: randomString.generate({
          length: 12,
          charset: "alphabetic",
        }),
        description: randomString.generate({
          length: 30,
          charset: "alphabetic",
        }),
      };
      const createTaskResponse = await request(app)
        .post("/api/tasks/create")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${token}`)
        .send(requestBody);

      assert.equal(createTaskResponse.status, 200);
      assert.isNotEmpty(createTaskResponse.body);
      assert.equal(createTaskResponse.body.success, true);
      assert.property(createTaskResponse.body, "task");
      taskIdsArray.push(createTaskResponse.body.task._id);
    }

    return { taskIdsArray, boardId, token };
  }

  async createUserWithBoard() {
    const userDetails = await this.createUser();

    const boardDetails = await this.createBoard(userDetails.token);

    return {
      ...boardDetails,
      ...userDetails,
    };
  }

  async createMBoardsAndNTasksHandler(noOfBoards, noOfTasks) {
    const userDetails = await this.createUser();
    const boardIdsArray = [];
    const tasksIdsArray = [];

    for (let i = 0; i < noOfBoards; i++) {
      const createBoardResponse = await request(app)
        .post("/api/boards")
        .set("Content-Type", "application/json")
        .set("Cookie", `token=${userDetails.token}`);

      assert.equal(createBoardResponse.status, 200);
      assert.isNotEmpty(createBoardResponse.body);
      assert.equal(createBoardResponse.body.success, true);
      assert.exists(createBoardResponse.body.boardId);
      assert.isNotEmpty(createBoardResponse.body.boardId);
      assert.match(createBoardResponse.body.boardId, objectIdRegex);
      boardIdsArray.push(createBoardResponse.body.boardId);

      const { taskIdsArray: taskIds } = await this.createNTasksHandler(
        createBoardResponse.body.boardId,
        userDetails.token,
        noOfTasks,
      );

      tasksIdsArray.push(...taskIds);
    }

    return { boardIdsArray, tasksIdsArray, ...userDetails };
  }
}
