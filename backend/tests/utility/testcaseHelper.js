import request from "supertest";
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
    const userId = arr[arr.length - 1];

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
    assert.equal(
      removeUserResponse.body.message,
      `User with id ${userId} removed successfully with 0 boards deleted and 0 tasks deleted`,
    );

    return { userId };
  }
}
