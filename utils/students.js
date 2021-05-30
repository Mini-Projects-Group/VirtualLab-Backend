/*
name,
email,
password,
roll_no,
batch,
subjects,
branch,
div,
registration_id
*/

/*

31142 

3 => year
1 => comp
1 => div,
42 => roll_no

*/

/*

C:{
    2 : ['','','','','',''],
    3 : ['SDL','CNL','DBMSL','ESIOTL','WTL','SPOSL'],
    4 : ['','','','','',''],
},
I:{  
    2 : ['','','','','',''],
    3 : ['','','','','',''],
    4 : ['','','','','',''],
}
E:{   
    2 : ['','','','','',''],
    3 : ['','','','','',''],
    4 : ['','','','','',''],
}

roll_no%100 => class_rollno  ; roll_no/=100;  => temp = class_rollno/20 + 1;
roll_no%10 => division; roll_no/=10;
roll_no%10 => branch; roll_no/=10;
roll_no => year;


*/

/*
batch

C:{
    2:{
        1: 'E1',
        2: 'F1',
        3: 'G1',
        4: 'H1'
    },
    3:{
        1: 'K1',
        2: 'L1',
        3: 'M1',
        4: 'N1'
    },
    4:{
        
    }
}

 */

let branch_map = {
  1: "C",
  2: "E",
  3: "I",
};

const batches = {
  1: ["A", "B", "C"],
  2: {
    C: ["E", "F", "G", "H"],
    E: ["E", "F", "G", "H"],
    I: ["E", "F", "G", "H"],
  },
  3: {
    C: ["K", "L", "M", "N"],
    E: ["K", "L", "M", "N"],
    I: ["K", "L", "M", "N"],
  },
  4: {
    C: ["P", "Q", "R", "S"],
    E: ["P", "Q", "R", "S"],
    I: ["P", "Q", "R", "S"],
  },
};

const subjects = {
  C: {
    2: ["", "", "", "", "", ""],
    3: ["SDL", "CNL", "DBMSL", "ESIOTL", "WTL", "SPOSL"],
    4: ["", "", "", "", "", ""],
  },
  I: {
    2: ["", "", "", "", "", ""],
    3: ["", "", "", "", "", ""],
    4: ["", "", "", "", "", ""],
  },
  E: {
    2: ["", "", "", "", "", ""],
    3: ["", "", "", "", "", ""],
    4: ["", "", "", "", "", ""],
  },
};

const getStudentDetails = (roll_no) => {
  let temp_roll_no = roll_no;

  let class_roll_no = temp_roll_no % 100;
  temp_roll_no = Math.floor(temp_roll_no / 100);

  let div = temp_roll_no % 10;
  temp_roll_no = Math.floor(temp_roll_no / 10);

  let branch = branch_map[temp_roll_no % 10];
  temp_roll_no = Math.floor(temp_roll_no / 10);

  let year = temp_roll_no;

  let my_subjects = subjects[branch][year];

  let my_batch = batches[year][branch][Math.floor(class_roll_no / 20)] + div;

  console.log(
    class_roll_no +
      "  " +
      div +
      "  " +
      branch +
      "  " +
      year +
      " " +
      my_subjects +
      " " +
      my_batch
  );

  return { year, branch, div, my_batch, my_subjects };
};

// const res = getStudentDetails(31142);
// console.log(res);

module.exports = {
  getStudentDetails,
};
