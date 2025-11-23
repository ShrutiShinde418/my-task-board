import request from "supertest";
import app from "../../src/index.js";

describe("Integration Tests for login controller", () => {
  describe("Positive testcases for login controller", () => {
    it("should successfully signup and login a user", async () => {
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

      const removeUserResponse = await request(app)
        .post(`/api/remove/user/${userId}`)
        .set("Content-Type", "application/json");

      assert.equal(removeUserResponse.status, 200);
      assert.isNotEmpty(removeUserResponse.body);
      assert.equal(removeUserResponse.body.success, true);
      assert.equal(
        removeUserResponse.body.message,
        `User with id ${userId} removed successfully`,
      );
    });
  });

  describe("Negative testcases for login controller", () => {
    it("should fail to login a user when the request body contains invalid JSON", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}gmail.com`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/login")
        .set("Content-Type", "application/json")
        .send(requestBody + "fsdljsdf");

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

    it("should fail to login a user when request body contains an invalid email - Case 1", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}gmail.com`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login a user when request body contains an invalid email - Case 2", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmailcom`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login a user when request body contains an invalid email - Case 3", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login user when password does not have enough characters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkd`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login user when password contains only letters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkdfvfvfvdvf`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login user when password contains only numbers", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `78273873454`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login user when password does not have any special characters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkdssjf238432`,
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login user when request contains unknown parameters", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkdssjf@238432`,
        unknown: "fsdklfjsdk",
      };

      const response = await request(app)
        .post("/api/login")
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

    it("should fail to login user when user does not exist", async () => {
      const requestBody = {
        email: `testuser${Math.floor(Math.random() * 90000 + 10000)}@gmail.com`,
        password: `sdfkd@svff${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const response = await request(app)
        .post("/api/login")
        .set("Content-Type", "application/json")
        .send(requestBody);

      assert.equal(response.status, 400);
      assert.isNotEmpty(response.body);
      assert.equal(response.body.success, false);
      assert.isNotEmpty(response.body.error);
      assert.equal(response.body.error.code, 424);
      assert.equal(response.body.error.message, "User doesn't exist");
    });

    it("should fail to login user when the password does not match", async () => {
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
        .send({ email: requestBody.email, password: "fsdfsfj@49934553" });

      assert.equal(loginResponse.status, 400);
      assert.isNotEmpty(loginResponse.body);
      assert.equal(loginResponse.body.success, false);
      assert.equal(loginResponse.body.error.code, 425);
      assert.equal(
        loginResponse.body.error.message,
        `Either email or password is invalid`,
      );

      const removeUserResponse = await request(app)
        .post(`/api/remove/user/${userId}`)
        .set("Content-Type", "application/json");

      assert.equal(removeUserResponse.status, 200);
      assert.isNotEmpty(removeUserResponse.body);
      assert.equal(removeUserResponse.body.success, true);
      assert.equal(
        removeUserResponse.body.message,
        `User with id ${userId} removed successfully`,
      );
    });
  });
});
