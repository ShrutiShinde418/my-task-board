import request from "supertest";
import app from "../../src/index.js";

describe("Integration Tests for signup controller", () => {
  describe("Negative testcases for signup controller", () => {
    it("should be able to signup user when request body contains invalid JSON", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}gmail.com`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody + "sjkdsf");

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Request Body contains invalid JSON",
      );
    });

    it("should fail to signup user when request body contains an invalid email - Case 1", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}gmail.com`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Please enter a valid email address.",
      );
    });

    it("should fail to signup user when request body contains an invalid email - Case 2", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmailcom`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Please enter a valid email address.",
      );
    });

    it("should fail to signup user when request body contains an invalid email - Case 3", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Please enter a valid email address.",
      );
    });

    it("should fail to signup user when user already exists", async () => {
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

      const signUpResponse = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(signUpResponse.status, 400);
      assert.isNotEmpty(signUpResponse.body);
      assert.equal(signUpResponse.body.success, false);
      assert.isNotEmpty(signUpResponse.body.error);
      assert.equal(signUpResponse.body.error.code, 423);
      assert.equal(signUpResponse.body.error.message, "User already exists");

      const arr = response.body.message.split(" ");
      const userId = arr[arr.length - 1];

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
    });

    it("should fail to signup user when password does not have enough characters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkd`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Password should have minimum eight characters, at least one letter, one number and one special character",
      );
    });

    it("should fail to signup user when password contains only letters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkdfvfvfvdvf`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Password should have minimum eight characters, at least one letter, one number and one special character",
      );
    });

    it("should fail to signup user when password contains only numbers", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `78273873454`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Password should have minimum eight characters, at least one letter, one number and one special character",
      );
    });

    it("should fail to signup user when password does not have any special characters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkdssjf238432`,
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "Password should have minimum eight characters, at least one letter, one number and one special character",
      );
    });

    it("should fail to signup user when request has unknown parameters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkdss@jf238432`,
        unknown: "sdfkdfdsfd",
      };

      const response = await request(app)
        .post("/api/signup")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 422);
      assert.equal(
        response.body.error.message,
        "The request includes unsupported or unrecognized parameter(s).",
      );
    });
  });

  describe("Positive testcases for signup controller", () => {
    it("should be able to signup with a valid email and password", async () => {
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
    });
  });
});
