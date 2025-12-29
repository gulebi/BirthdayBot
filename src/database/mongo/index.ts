import mongoose from "mongoose";
import getEnvVar from "../../utils/env";

export async function mongoConnect() {
    await mongoose.connect(getEnvVar("MONGODB_URI")).then(
        () => console.log("Bot has connected to MongoDB!"),
        (err) => console.error(err)
    );
}

export * from "./handlers/birthdays";
export * from "./handlers/settings";
