import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { forEach } from "ramda";
import { PrismaClient } from "../src/prisma.client";
import { FavoriteType } from "@prisma/client";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaClient;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaClient);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it("/planets (GET) without user header fails with 400", async () => {
    return request(app.getHttpServer())
      .get("/planets")
      .expect(400)
      .expect("content-type", /json/)
      .then((response) => {
        expect(response.body.message).toMatch(/`user-id` not sent in headers/);
      });
  });

  it("/planets (GET) with wrong user header format fails with 400", async () => {
    await request(app.getHttpServer())
      .get("/planets")
      .set("user-id", "1")
      .expect(400)
      .expect("content-type", /json/)
      .then((response) => {
        expect(response.body.message).toMatch(
          /`user-id` is not a valid v4 uuid/,
        );
      });

    await request(app.getHttpServer())
      .get("/planets")
      .set("user-id", "63717ed2-cfbc-405d-9baf-")
      .expect(400)
      .expect("content-type", /json/)
      .then((response) => {
        expect(response.body.message).toMatch(
          /`user-id` is not a valid v4 uuid/,
        );
      });
  });

  it("/planets (GET) with correct headers", async () => {
    const favorite_identifier = "https://swapi.dev/api/planets/2/";

    const user = await prisma.user.create({ data: {} });
    await prisma.userFavorite.create({
      data: {
        user_id: user.id,
        favorite_type: FavoriteType.Planet,
        favorite_identifier,
        custom_label: "Aldar-behen",
      },
    });

    const user2 = await prisma.user.create({ data: {} });

    const expectCommon = (
      response: request.Response,
      onFavoriteIdentifierMatch: (x: any) => void,
    ) => {
      const { body } = response;

      expect(body).toHaveLength(10);

      forEach((x: any) => {
        expect(x).toHaveProperty("created");

        expect(x).toHaveProperty("url");
        expect(typeof x.url).toBe("string");

        expect(x).toHaveProperty("name");
        expect(typeof x.name).toBe("string");

        expect(x).toHaveProperty("updated");

        expect(x).toHaveProperty("is_favourite");
        expect(typeof x.is_favourite).toBe("boolean");

        expect(x).toHaveProperty("original_name");
        expect(typeof x.original_name).toBe("string");

        // Does not match since UserID is not the same as the one who did this.
        if (x.url === favorite_identifier) {
          onFavoriteIdentifierMatch(x);
        }
      }, body);
    };

    await request(app.getHttpServer())
      .get("/planets")
      .set("user-id", user2.id)
      .expect(200)
      .expect("content-type", /json/)
      .then((response: request.Response) => {
        expectCommon(response, (x) => {
          expect(x.original_name).toBe("Alderaan");
          expect(x.name).toBe("Alderaan");
          expect(x.updated).toBeNull();
        });
      });

    await request(app.getHttpServer())
      .get("/planets")
      .set("user-id", user.id)
      .expect(200)
      .expect("content-type", /json/)
      .then((response) => {
        expectCommon(response, (x) => {
          expect(x.original_name).toBe("Alderaan");
          expect(x.name).toBe("Aldar-behen");
          expect(typeof x.updated).toBe("string");
        });
      });

    // clean the DB
    await prisma.userFavorite.deleteMany({});
    await prisma.user.deleteMany({});
  });
});
