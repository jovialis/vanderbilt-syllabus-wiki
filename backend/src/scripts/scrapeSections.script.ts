/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import * as yes from "@vanderbilt/yes-api";
import initDatabase from "../utils/initDatabase.js";
import modelSection from "../models/section.model.js";
import modelTerm from "../models/term.model.js";

initDatabase();
const Term = modelTerm();
const Section = modelSection();

Term.findOne({_id: '0980'}).then((term: yes.Term) => {
    yes.getAllSections(term, false, async (section: yes.Section) => {

        const uid = `${section.term}_${section.id}`

        try {
            if (await Section.exists({_id: uid})) {
                console.log(`Updating ${uid} (${section.course.abbreviation}-${section.number})`);

                await Section.updateOne({_id: uid}, section);
            } else {
                console.log(`Creating ${uid} (${section.course.abbreviation}-${section.number})`);

                await Section.create({
                    _id: uid,
                    ...section
                });
            }
        } catch (e) {
            console.log(e);
            console.log(section)
        }

    }).then(res => {
        console.log('Scraped ' + res.length + ' Sections.');
        process.exit(0);
    });
});