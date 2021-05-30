const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }],
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty'
    }
},{ timestamps: true, collection: 'lab'});

module.exports = mongoose.model('lab', labSchema);