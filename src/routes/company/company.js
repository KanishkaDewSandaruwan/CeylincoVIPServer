const express = require('express');
const { getAllCompanies, findCompany, addCompany, updateCompany, deleteCompany } = require('../../controllers/CompanyControlller');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.get('/all', getAllCompanies);
  router.get('/:company_id', findCompany);
  router.post('/create', addCompany);
  router.put('/update/:company_id', updateCompany);
  router.delete('/delete/:company_id', deleteCompany);
  
  return router;
};
