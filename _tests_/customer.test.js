const ControllerCustomer = require("../controllers/customers");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const fs = require("fs");

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6NDE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzdGV2ZW4gYW5kcmUiLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE2NDUyODEyODAsImV4cCI6MTY0NTI4NDg4MH0.0x65CjMY4I3gYknqRmzHKd4g0AHF-NNS4mYR6y5ectA";

let registerData = {
  username: "tested_user",
  email: "tested@test.com",
  password: "tested1",
  phoneNumber: "tested1",
  address: "tested1",
};
beforeAll(async () => {
  try {
    let data = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    // console.log(data, `data`);
    await queryInterface.bulkInsert("Movies", data);
  } catch (error) {
    console.log(error);
  }
});
afterAll(async () => {
  await queryInterface.bulkDelete("Movies", null);
});

describe(`POST /customers/register`, () => {
  afterEach(async () => {
    await User.destroy({
      where: {
        email: registerData.email,
      },
    });
  });

  describe(`POST /customers/register - SUCCESS`, () => {
    it(`Should return status(201) with obj(User)`, async () => {
      const response = await request(app)
        .post("/customers/register")
        .send(registerData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email");
    });
  });

  describe(`POST /customers/register - FAILURE`, () => {
    afterEach(() => {
      registerData = {
        username: "tested_user",
        email: "tested@test.com",
        password: "tested1",
        phoneNumber: "tested1",
        address: "tested1",
      };
    });

    describe(`Email tidak diberikan / tidak diinput`, () => {
      it(`Should return status(400) with error("Email Cannot be Null")`, async () => {
        delete registerData.email;
        const response = await request(app)
          .post("/customers/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.body, `ERROr`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email Cannot be Null");
      });
    });

    describe(`Password tidak diberikan / tidak diinput`, () => {
      it(`Should return status(400) with error("Password Cannot be Null")`, async () => {
        delete registerData.password;
        const response = await request(app)
          .post("/customers/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Password Cannot be Null");
      });
    });

    describe(`Email diberikan string kosong`, () => {
      it(`Should return status(400) with error("Email is Required")`, async () => {
        registerData.email = "";
        const response = await request(app)
          .post("/customers/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email is Required");
      });
    });

    describe(`Password diberikan string kosong`, () => {
      it(`Should return status(400) with error("Password is Required")`, async () => {
        registerData.password = "";
        const response = await request(app)
          .post("/customers/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Password is Required");
      });
    });

    describe(`Format Email salah / invalid`, () => {
      it(`Should return status(400) with error("Must be in Email Format")`, async () => {
        registerData.email = "tested";
        const response = await request(app)
          .post("/customers/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Must be in Email Format");
      });
    });

    describe(`Email sudah terdaftar`, () => {
      it(`Should return status(400) with error("Email Already Registered")`, async () => {
        await request(app).post("/customers/register").send(registerData);

        const response = await request(app)
          .post("/customers/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email Already Registered");
      });
    });
  });
});

describe(`POST /customers/login`, () => {
  beforeAll(async () => {
    registerData.role = "user";
    await User.create(registerData);
  });
  afterAll(async () => {
    await User.destroy({
      where: {
        email: registerData.email,
      },
    });
  });
  describe(`POST /customers/login - SUCCESS`, () => {
    it(`Should return status(200) with obj(token, username, role)`, async () => {
      const response = await request(app)
        .post("/customers/login")
        .send({ email: registerData.email, password: registerData.password });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token", expect.any(String));
      expect(response.body).toHaveProperty("username", expect.any(String));
      expect(response.body).toHaveProperty("role", expect.any(String));
    });
  });

  describe(`POST /customers/login - FAILURE`, () => {
    it(`Wrong Email - status(401) with Error("Wrong Email or Password")`, async () => {
      const response = await request(app)
        .post("/customers/login")
        .send({ email: "wrong@email.com", password: registerData.password });
      expect(response.status).toBe(401);
      // expect(response.body).toBeInstanceOf(Error);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Wrong Email or Password");
    });

    it(`Wrong Password - status(401) with Error("Wrong Email or Password")`, async () => {
      const response = await request(app)
        .post("/customers/login")
        .send({ email: registerData.email, password: "wrongPassword" });
      expect(response.status).toBe(401);
      // expect(response.body).toBeInstanceOf(Error);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Wrong Email or Password");
    });
  });
});

describe(`GET /customers/movies`, () => {
  describe(`GET /customers/movies - SUCCESS`, () => {
    it(`GET ALL - status(200) with obj(movies)`, async () => {
      const response = await request(app).get("/customers/movies")
      .send()
      .set("access_token", access_token)
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
      expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
      expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });

    it(`GENRE FILTER - status(200) with obj(movies)`, async () => {
      const response = await request(app)
        .get("/customers/movies?genre=1")
        .send();
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
      expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
      expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
      expect(response.body[0].genreId).toBe(1);
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });
    it(`RATING FILTER - status(200) with obj(movies)`, async () => {
      const response = await request(app)
        .get("/customers/movies?rating=1")
        .send();
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
      expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
      expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
      expect(response.body[0].rating).toBe(1);
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });
    it(`PAGE 2 - status(200) with obj(movies)`, async () => {
      const response = await request(app)
        .get("/customers/movies?page=2")
        .send();
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
      expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
      expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
      // expect(response.body[0].id).toBe(9);
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });
  });
  describe(`GET /customers/movies/:movieId - SUCCESS`, () => {
    it(`Should return status(200) with obj(movie)`, async () => {
      const response = await request(app).get("/customers/movies/2").send();
      expect(response.status).toBe(200);
      // expect obj
      expect(response.body).toHaveProperty("title", expect.any(String));
      expect(response.body).toHaveProperty("synopsis", expect.any(String));
      expect(response.body).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body).toHaveProperty("rating", expect.any(Number));
      expect(response.body).toHaveProperty("genreId", expect.any(Number));
      expect(response.body).toHaveProperty("authorId", expect.any(Number));
      expect(response.body).toHaveProperty("status", expect.any(String));
    });
  });
  describe(`GET /customers/movies/:movieId - FAILURE`, () => {
    it(`Should return status(404) with Error("Error Movie not Found")`, async () => {
      const response = await request(app).get("/customers/movies/1000").send();
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Error Movie not Found");
    });
  });
});

describe(`GET/POST /customers/watchLists`, () => {
  describe(`GET /customers/watchLists - SUCCESS`, () => {
    it(`GET ALL - Should return status(200) with obj(watchLists)`, async () => {
      const response = await request(app)
        .get("/customers/watchLists/2")
        .send()
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      // expect obj
      expect(response.body).toHaveProperty("Movies", expect.any(String));
      expect(response.body).toHaveProperty("Movies", expect.any(String));
      expect(response.body).toHaveProperty("synopsis", expect.any(String));
      expect(response.body).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body).toHaveProperty("rating", expect.any(Number));
      expect(response.body).toHaveProperty("genreId", expect.any(Number));
      expect(response.body).toHaveProperty("authorId", expect.any(Number));
      expect(response.body).toHaveProperty("status", expect.any(String));
    });
  });

  describe(`POST /customers/watchLists - SUCCESS`, () => {
    it(`POST - Should return status(201) with obj(watchLists)`, async () => {
      const response = await request(app)
        .post("/customers/watchLists")
        .send()
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      // expect obj
      expect(response.body).toHaveProperty("title", expect.any(String));
      expect(response.body).toHaveProperty("synopsis", expect.any(String));
      expect(response.body).toHaveProperty("trailerUrl", expect.any(String));
      expect(response.body).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body).toHaveProperty("rating", expect.any(Number));
      expect(response.body).toHaveProperty("genreId", expect.any(Number));
      expect(response.body).toHaveProperty("authorId", expect.any(Number));
      expect(response.body).toHaveProperty("status", expect.any(String));
    });
  });
});
