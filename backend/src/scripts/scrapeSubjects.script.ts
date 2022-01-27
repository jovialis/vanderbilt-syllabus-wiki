/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import * as yes from "@vanderbilt/yes-api";
import modelSubject from "../models/subject.model.js";
import initDatabase from "../utils/initDatabase.js";

initDatabase();
const Subject = modelSubject();

yes.getSubjects(async (subject: yes.Subject) => {

    if (await Subject.exists({_id: subject.id})) {
        console.log('Updating ' + subject.name);
        await Subject.updateOne({_id: subject.id}, subject);
    } else {
        console.log('Creating ' + subject.name);
        await Subject.create({_id: subject.id, ...subject});
    }

}).then(res => {
    console.log('Scraped ' + res.length + ' Subjects and updated.');
    process.exit(0);
});