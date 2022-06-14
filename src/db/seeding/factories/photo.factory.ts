import { define } from "typeorm-seeding";

import { Photo } from "../../../api/photo/photo.entity";

define(Photo, (faker) => {
    const photo = new Photo();
    photo.filename = faker.image.imageUrl()
    return photo;
});