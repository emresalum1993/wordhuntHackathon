const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    mail: { type: String, required: true },
    name: { type: String, required: true },
    registerTime: { type: Date },
    password: { type: String },
    score: { type: Number }

}, {
    collection: 'users'
});

const PoolSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    words: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SingleWord"
    }]
}, {
    collection: 'pools'
});

const HistorySchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    words: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SingleWord"
    }]
}, {
    collection: 'history'
});


const SingleWordSchema = new Schema({
    sourceLang: { type: String, required: false },
    destLang: { type: String, required: false },
    original: { type: String, required: true },
    translated: { type: String, required: true },
    source: { type: Number },
    score: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date }
}, {
    collection: 'singleWords'
})
const User = mongoose.model("User", UserSchema);
const Pool = mongoose.model("Pool", PoolSchema);
const Word = mongoose.model("Word", SingleWordSchema);
const History = mongoose.model("History", HistorySchema);
module.exports = { User, Pool, Word, History }