export const Schema = {
    "master_screener": {
        index: "questions",
        type: "screener",

    },
    "queries": {
        index: "master_screener",
        type: "queries",
    },
    "programs": {
        index: "programs",
        type: "user_facing",
    }
};