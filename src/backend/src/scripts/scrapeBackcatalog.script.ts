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

Term.find().then(async (terms: yes.Term[]) => {
    for (const term of terms) {
        // Store the Sections we've fetched to prevent double-uploading.
        const fetchedSections: string[] = [];

        const sections = await yes.getAllSections(term, false, async (section: yes.Section) => {

            const uid = `${section.term}_${section.id}`;
            if (fetchedSections.includes(uid)) return;
            else fetchedSections.push(uid);

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

        });

        console.log('Scraped ' + sections.length + ' Sections in ' + term.title + '.');
    }

    process.exit(0);
});