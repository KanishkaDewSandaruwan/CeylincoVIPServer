const express = require('express');
const { getAllCompanies, findCompany, addCompany, updateCompany, deleteCompany } = require('../../controllers/CompanyControlller');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.get('/all', authenticateToken, getAllCompanies);
  router.get('/:company_id', authenticateToken,  findCompany);
  router.post('/create', authenticateToken,  addCompany);
  router.put('/update/:company_id', authenticateToken, updateCompany);
  router.delete('/delete/:company_id', authenticateToken, deleteCompany);
  
  return router;
};
