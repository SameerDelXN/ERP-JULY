import React from 'react'
//import Home from './hr/home/page'
//import LeavePage from './hr/leave/page'
//import Attendence from './hr/attendance/page'
//import Payroll from './hr/payroll/page'
//import SalaryPage from './hr/salary/page'
//import StaffPage from './hr/staff/page'

import Home from './home/page'
import LeavePage from './leave/page'
import Attendence from './attendance/page'
import PayrollPage from './payslip/page'
import SalaryPage from './salary/page'
import StaffPage from './staff/page'


const page = () =>{
  <>
  <Home/>
  <Attendence/>
  <StaffPage/>
  <PayrollPage/>
  <SalaryPage/>
  <LeavePage/>
  
  </>
}

export default page