const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const express = require("express")
const { v4: uuidv4 } = require('uuid');
const app = express();
const axios = require('axios').default;
let https = require('https');
var crypto = require('crypto');
const Modals = require("./modals/modal");

mongoose.connect("mongodb+srv://emresalum1993:n1i9e9e3@cluster0.ptm3u.mongodb.net/wordhunt?retryWrites=true&w=majority")
    //mongoose.connect("mongodb://app-makale-cosmos:4JDqlbVKKWzyUx2PgAlNwroWEQo7az1WzMHRTx7mzTchvhrqceVVansDBXDsg0tSOFUKnUQ2jKic9LMPFlRAvA==@app-makale-cosmos.mongo.cosmos.azure.com:10255/mongo_makale?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@app-makale-cosmos@", { useNewUrlParser: true })
    .then(() => {})
    .catch(() => {})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, AuthKey");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT")
    next();
});
var subscriptionKey = {
    translate: "a3ff857e24a54480ab5313dd3140a27a",
    bing: "56a66f6a9d48454181506cf83ab660bc"
};
var endpoint = {
    translate: "https://api.cognitive.microsofttranslator.com/",
    bing: "api.bing.microsoft.com"
}
var location = {
    translate: "westeurope",
    bing: "global"
}


app.use(express.json({ limit: '50mb' }));
app.post("/api/user/login", (req, res, next) => {
    var password = req.body.password;
    var hash
    if (!req.body.isHash) {
        hash = crypto.createHash('md5').update(password).digest('hex');
    } else {
        hash = req.body.password
    }
    Modals.User.findOne({ "mail": req.body.mail, "password": hash }).then(data => {
        if (data) {
            res.status(202).json({ message: "Giriş başarılı.", result: data });
        } else {
            res.status(202).json({ message: "Kullanıcı bulunamadı.", result: data });
        }
    })
});

app.post("/api/user/register", (req, res, next) => {
    const registerBody = req.body
    var password = req.body.password;
    var hash = crypto.createHash('md5').update(password).digest('hex');
    registerBody.password = hash
    const user = new Modals.User(registerBody)
    user.save().then(user => {
        res.status(200).json({
            message: "Başarıyla kayıt olundu",
            result: user,
        });
    });
});
app.get("/api/pools/:userId", (req, res, next) => {
    Modals.Pool.findOne({ "userId": req.params.userId }).populate({
        path: 'words',
        model: Modals.Word
    }).then(data => {
        if (data) {
            res.status(202).json({ message: "Havuz başarıyla bulundu.", result: data });
        } else {
            res.status(202).json({ message: "Havuz bulunamadı.", result: data });
        }
    })
});
app.get("/api/history/:userId", (req, res, next) => {
    Modals.History.findOne({ "userId": req.params.userId }).populate({
        path: 'words',
        model: Modals.Word,
        options: { sort: { 'date': -1 } }
    }).then(data => {
        if (data) {
            res.status(202).json({ message: "Geçmiş başarıyla bulundu.", result: data });
        } else {
            res.status(202).json({ message: "Gemçiş bulunamadı.", result: data });
        }
    })
});
app.post("/api/history/:userId", (req, res, next) => {
    const history = new Modals.History(req.body)
    history.save().then(pool => {
        res.status(200).json({
            message: "Başarıyla oluşturuldu",
            result: pool,
        });
    });
});
app.post("/api/pools/:userId", (req, res, next) => {
    const pool = new Modals.Pool(req.body)
    pool.save().then(pool => {
        res.status(200).json({
            message: "Başarıyla oluşturuldu",
            result: pool,
        });
    });
});
app.post("/api/pools/user/add", (req, res, next) => {
    var returnBody = {}
    Modals.Word.findOne({ "sourceLang": req.body.sourceLang, "destLang": req.body.destLang, "original": req.body.original, "translated": req.body.translated, "userId": req.body.userId }).then(data => {
        if (data) {
            req.body.source = 1
            req.body.score = req.body.translated.length * 10
            Modals.Pool.updateOne({ "userId": req.body.userId }, { $addToSet: { words: data._id } }).then(singleWord => {
                Modals.User.updateOne({ _id: req.body.userId }, { $inc: { score: req.body.score } }).then((user) => {
                    returnBody.score = {
                        type: "inc",
                        val: user.score
                    }
                })
                req.body.source = 0
                req.body.score = 0
                res.status(200).json({
                    message: "Kelime havuza eklendi",
                    result: returnBody
                });
            })
        } else {
            const word = new Modals.Word(req.body)
            word.save().then(word => {
                const savedWord = word
                req.body.source = 1
                req.body.score = req.body.translated.length * 10
                Modals.Pool.updateOne({ "userId": req.body.userId }, { $addToSet: { words: savedWord._id } }).then(singleWord => {
                    Modals.User.updateOne({ _id: req.body.userId }, { $inc: { score: req.body.score } }).then((user) => {
                        returnBody.score = {
                            type: "inc",
                            val: user.score
                        }
                    })
                    req.body.source = 0
                    req.body.score = 0
                    res.status(200).json({
                        message: "Kelime havuza eklendi",
                        result: returnBody
                    });
                })
            });
        }
    })
});
app.post("/api/pools/user/delete", (req, res, next) => {
    Modals.Pool.updateOne({ "userId": req.body.userId }, { $pull: { words: req.body.itemId } }).then(deletedWord => {
        res.status(200).json({
            message: "Single article deleted",
            result: deletedWord
        });
    })
})
app.get("/api/pools/user/aggregate", (req, res, next) => {
    Modals.Word.aggregate([{
        $group: {
            "_id": {
                "sourceLang": "$sourceLang",
                "destLang": "$destLang",
                "original": "$original",
                "translated": "$translated"
            },
            total: {
                $sum: 1
            }
        }
    }]).then(result => {
        res.status(200).json({
            message: "Toplu geldi",
            result: result
        });
    })
});
app.get("/api/rank/word", (req, res, next) => {
    Modals.Pool.find()
        .populate('userId', { name: 1, registerTime: 1, score: 1 }).then(result => {
            res.status(200).json({
                message: "Toplu geldi",
                result: result
            });
        })
});
app.post("/api/history/user/add", (req, res, next) => {
    var returnBody = {}
    Modals.Word.findOne({ "sourceLang": req.body.sourceLang, "destLang": req.body.destLang, "original": req.body.original, "translated": req.body.translated, "userId": req.body.userId }).then(data => {
        if (data) {
            req.body.source = 0
            req.body.score = 0
            Modals.History.updateOne({ "userId": req.body.userId }, { $push: { words: data._id } }).then(singleHistory => {
                returnBody.history = singleHistory
                res.status(200).json({
                    message: "Kelime havuza eklendi",
                    result: returnBody
                });
            })
        } else {
            const word = new Modals.Word(req.body)
            word.save().then(word => {
                Modals.History.updateOne({ "userId": req.body.userId }, { $push: { words: word._id } }).then(singleHistory => {
                    returnBody.history = singleHistory
                    res.status(200).json({
                        message: "Kelime havuza eklendi",
                        result: returnBody
                    });
                })
            });
        }
    })

});
app.post("/api/user/incscore", (req, res, next) => {
    Modals.User.updateOne({ _id: req.body.userId }, { $inc: { score: req.body.score } }).then((user) => {
        res.status(200).json({
            message: "Single article deleted",
            result: user
        });
    })
});

app.post("/api/translate", (req, res, next) => {


    axios({
        baseURL: endpoint.translate,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey.translate,
            'Ocp-Apim-Subscription-Region': location.translate,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': req.body.from,
            'to': req.body.to
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response) {
        res.status(200).json({
            message: "Başarıyla çevrildi.",
            result: JSON.stringify(response.data, null, 4),
        });

    })


});
app.get("/api/imagesearch/:term", (req, res, next) => {
    let request_params = {
        method: 'GET',
        hostname: endpoint.bing,
        path: '/v7.0/images/search' + '?q=' + encodeURIComponent(req.params.term) + "&count=1",
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey.bing,
        }
    };
    let response_handler = function(response) {
        let body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            res.status(200).json({
                message: "Başarıyla çevrildi.",
                result: body
            });
        });
    };
    let req2 = https.request(request_params, response_handler);
    req2.end();
});
module.exports = app;