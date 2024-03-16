
export { handle } from "./auth"

import { connect } from "$db/mongo.js"

connect()
    .then(() => {
        console.log('MongoDB started');
    })
    .catch((e) => {
        console.log('MongoDB failed to start');
        console.log(e);
    });