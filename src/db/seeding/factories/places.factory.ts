import { faker } from '@faker-js/faker';
import { define } from "typeorm-seeding";

import { Place } from "../../../api/places/places.entity";

define(Place, () => {
    const place = new Place();
    place.name = faker.name.lastName()
    place.like = faker.datatype.boolean()
    // place.photo = faker.image.imageUrl()
    place.uuid = faker.datatype.uuid()
    return place;
});