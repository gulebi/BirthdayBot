import mongoose from "mongoose";
import getEnvVar from "./env";
import { BirthdayModel } from "./Models";
import { Birthday } from "../types";

export async function mongoConnect() {
    await mongoose.connect(getEnvVar("MONGODB_URI")).then(
        () => console.log("Bot has connected to MongoDB!"),
        (err) => console.error(err)
    );
}

export async function birthdayAdd(userID: string, date: string): Promise<Birthday> {
    const added = await BirthdayModel.findOneAndUpdate(
        { userID },
        { userID, date, $inc: { ver: 1 } },
        { upsert: true, new: true }
    );
    console.log(added);

    return added;
}

export async function birthdayRemove(userID: string): Promise<Birthday | null> {
    const removed = await BirthdayModel.findOneAndDelete({ userID });
    console.log(removed);

    return removed;
}

export async function birthdayList(): Promise<Birthday[]> {
    const list = await BirthdayModel.find({}).lean();
    return list;
}
