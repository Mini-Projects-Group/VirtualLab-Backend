const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, 
    { 
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => console.log('DB connected'));

