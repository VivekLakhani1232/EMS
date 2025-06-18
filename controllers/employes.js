const db = require('../config/db');
const { QueryTypes }  = require('sequelize')

exports.createEmployee = async (req, res) => {
  try {

      const { employee_name, email, birthdate, mobile, department_id } = req.body;
      const files = req.files;

    if (!employee_name || !email || !mobile ) {
      return res.status(400).json({ message: 'All fields are required' });
    }  
    
    const checkUnique = await db.query(`select mobile ,email  from ems.employees e where email = $1 or mobile = $2 `,{
      bind : [email , mobile] ,
      type : QueryTypes.SELECT
    }) ;
    
    if(checkUnique.length > 0){
      return res.status(400).json({ message: 'Email or phone number already exists. Please use different values.' });
    }

    const [employee] = await db.query(
      `INSERT INTO ems.employees (employee_name, email, birthdate, mobile, department_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      { bind: [employee_name, email, birthdate, mobile, department_id] , type : QueryTypes.INSERT }
    );

    const id = employee[0].employee_id;

    for (const file of files) {
      const fullUrl = `http://localhost:3000/uploads/${file.filename}`;
      await db.query(
        `INSERT INTO ems.documents (document_name, document_type, document_size, path, employee_id)
         VALUES ($1, $2, $3, $4, $5)`,
        {
          bind: [
            file.originalname,
            file.mimetype,
            file.size,
            fullUrl,
            id
          ] ,
           type : QueryTypes.INSERT 
        }
      );
    }

    res.status(200).json({ message: 'Employee data store successfully with doc' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Employee data not add' });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {

    let {search , shortCollums , orderBy } = req.body

    let employeQuery = `
      select * from ems.employees e 
    `;

    if (search) {
      employeQuery += ` where employee_name ilike '%${search}%' or email ilike '%${search}%' OR mobile ilike '%${search}%'`;
    }    

    if(shortCollums && orderBy ){
      employeQuery += `  order by ${shortCollums} ${orderBy} ;`
    }

    console.log('employeQuery :>> ', employeQuery);

    const employeData = await db.query(employeQuery)

    res.status(200).json({data : employeData[0] , message : 'employe data list successfully'});

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'employe data not found' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {

    const { employee_name, email, birthdate, mobile, department_id , employee_id } = req.body;

    if (!employee_name || !email || !mobile ) {
      return res.status(400).json({ message: 'All fields are required' });
    }  
    
    const checkUnique = await db.query(`select mobile ,email  from ems.employees e where employee_id != $1 and  (email = $2 or mobile = $3) ; `,{
      bind : [employee_id , email , mobile] ,
      type : QueryTypes.SELECT
    })  

    if(checkUnique.length > 0){
      return res.status(400).json({ message: 'Email or phone number already exists. Please use different values.' });
    }

   let employDataUpdate =  await db.query(`
      update ems.employees set employee_name = $1, email = $2, birthdate = $3, mobile = $4, department_id = $5, updated_on = now() WHERE employee_id = $6
    `, { bind: [employee_name, email, birthdate, mobile, department_id, employee_id] , type : QueryTypes.UPDATE });

    res.status(200).json({ message: 'Employee data updated' });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Employee data not updated' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {

    const id = req.query.id;

    let [checkId] = await db.query(`select employee_id  from ems.employees e where employee_id = $1 ;`,{
      bind : [id],
      type : QueryTypes.SELECT
    })

    if (!checkId) {
     return res.status(400).json({ message: "Please pass a valid employee ID" });
    }

    let deleteEmploye = await db.query(`delete from ems.employees where employee_id = $1`, { bind: [id] , type : QueryTypes.DELETE });
   
    res.status(200).json({ message: 'Employee data deleted' });

  } catch (error) {
    res.status(500).json({ error: 'Employee data not deleted' });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    const [employeData] = await db.query(`
      select * from ems.departments d ;
    `);
    res.status(200).json({data : employeData , message : 'departments data list successfully'});

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'departments data not found' });
  }
};
