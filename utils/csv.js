const csvParser = require('csv-parser');
const fs = require('fs');
const addNewStudents = require('./addNewStudents');



const readCSV = async (fileName) => {
    const newStudents = [];
    fs.createReadStream(`./tmp/${fileName}`)
    .pipe(csvParser())
    .on('data', (data) => {
        let keys = Object.keys(data);
        newStudents.push({
            registration_id: data[keys[0]],
            name: data.Name,
            roll_no: data['RollNo'],
            email: data['Email']
        });
    })
    .on('end', async () =>{
        console.log('File has been read');
        fs.unlinkSync(`./tmp/${fileName}`);

        await addNewStudents(newStudents);

        return newStudents;
    })
}

module.exports = readCSV;