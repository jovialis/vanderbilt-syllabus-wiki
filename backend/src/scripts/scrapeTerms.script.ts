/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import * as yes from "@vanderbilt/yes-api";
import initDatabase from "../utils/initDatabase.js";
import modelTerm from "../models/term.model.js";

initDatabase();
const Term = modelTerm();

yes.getTerms(async (term: yes.Term) => {

    if (await Term.exists({_id: term.id})) {
        console.log('Updating ' + term.title);
        await Term.updateOne({_id: term.id}, term);
    } else {
        console.log('Creating ' + term.title);
        await Term.create({_id: term.id, ...term});
    }

}).then(res => {
    console.log('Scraped ' + res.length + ' Terms.');
    process.exit(0);
});