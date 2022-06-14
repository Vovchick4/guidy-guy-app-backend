// @/src/db/seeding/seeds/initialSeed.ts
import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";

import { Place } from "../../../api/places/places.entity";
import { Photo } from "../../../api/photo/photo.entity";

export default class InitialDatabaseSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const photo = await factory(Photo)().createMany(15);

        await factory(Place)()
            .map(async (place) => {
                // place.photo = photo[Math.floor(Math.random() * photo.length)];
                return place;
            })
            .createMany(100);
    }
}