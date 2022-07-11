// You can load you .env file here synchronously using dotenv package (not installed here),
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// const environment = process.env.NODE_ENV || 'development';
// const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...

import { Quest } from "src/api/quest/quest.entity";
import { User } from "src/api/users/users.entity";
import { Photo } from "src/api/photo/photo.entity";
import { Place } from "src/api/places/places.entity";

// Check typeORM documentation for more information.
const config: any = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Place, Photo, User, Quest],

    // We are using migrations, synchronize should be set to false.
    synchronize: true,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: true,
    logging: true,
    logger: 'file',

    // allow both start:prod and start:dev to use migrations
    // __dirname is either dist or src folder, meaning either
    // the compiled js in prod or the ts in dev
    migrations: ['dist/migrations/**/*{.ts,.js}'],
    // SEEDING.TS
    seeds: ["src/db/seeding/seeds/**/*{.ts,.js}"],
    factories: ["src/db/seeding/factories/**/*{.ts,.js}"],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
    },
};

export = config;