const Lab = require('../models/lab');

const TE = {
    C: {
        Subjects: ['DBMSL','SDL','CNL','ESIOTL','WTL','SPOSL'],
        Batches: ['K','L','M','N'],
        Class: [1,2,3,4]
    },
    E: {
        Subjects: ['DC','ESD'],
        Batches: ['K','L','M','N'],
        Class: [5,6,7,8]
    },
    I: {
        Subjects: ['OSL','CNL','DBMSL'],
        Batches: ['K','L','M','N'],
        Class: [9,10,11]
    }
};


const addLab = async (subject, branch, year, batch, students, faculty) => {
    let labExist = await Lab.findOne({subject, batch, branch});
    if(labExist) return;
    
    let newLab = new Lab({ subject, branch, year, batch, students, faculty});

    await newLab.save();
}

module.exports = {
    TE,
    addLab
}