const db = require('../config/db');
const { QueryTypes }  = require('sequelize')

exports.createEmployee = async (req, res) => {
  try {

      const { employee_name, email, birthdate, mobile, department_id } = req.body;
      const files = req.files;

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
