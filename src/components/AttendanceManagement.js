import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { attendanceAPI, employeeAPI } from '../services/api';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(15, 118, 110, 0.1);

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  color: #0f172a;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const FormSection = styled.div`
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const FormTitle = styled.h3`
  color: #0f172a;
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.4rem;
  color: #334155;
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.65rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
  }
`;

const Select = styled.select`
  padding: 0.65rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
  }
`;

const Button = styled.button`
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  align-self: end;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.1rem;
  background: #475569;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #334155;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 0.75rem;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 480px;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f1f5f9;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.65rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.85rem;
  ${props => props.status === 'Present' ? `
    background: #d1fae5;
    color: #065f46;
  ` : `
    background: #fee2e2;
    color: #991b1b;
  `}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
`;

const SuccessMessage = styled.div`
  background: #ecfdf5;
  color: #047857;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #a7f3d0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
`;

function AttendanceManagement() {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filteredEmployee, setFilteredEmployee] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [formData, setFormData] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  const fetchEmployees = async (config = {}) => {
    try {
      const response = await employeeAPI.getAll(config);
      if (config.signal?.aborted) return;
      setEmployees(response.data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Failed to load employees:', err);
      }
    }
  };

  const fetchAttendances = async (config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceAPI.getAll(config);
      if (config.signal?.aborted) return;
      setAttendances(response.data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError('Failed to load attendance records. Please try again.');
      console.error(err);
    } finally {
      if (!config.signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchEmployees({ signal });
    fetchAttendances({ signal });
    return () => controller.abort();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await attendanceAPI.create(formData);
      setSuccess('Attendance marked successfully!');
      setFormData((prev) => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
      }));
      fetchAttendances();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.date?.[0] || 
                      err.response?.data?.employee?.[0] ||
                      'Failed to mark attendance. Please try again.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilter = async () => {
    if (!filteredEmployee) {
      fetchAttendances();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await attendanceAPI.getByEmployee(filteredEmployee);
      setAttendances(response.data);
    } catch (err) {
      setError('Failed to filter attendance records. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilteredEmployee('');
    setFilterDate('');
    fetchAttendances();
  };

  const displayedAttendances = attendances.filter((att) => {
    if (filterDate) {
      return att.date === filterDate;
    }
    return true;
  });

  return (
    <Container>
      <Title>Attendance Management</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormSection>
        <FormTitle>Mark Attendance</FormTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="employee">Employee *</Label>
            <Select
              id="employee"
              name="employee"
              value={formData.employee}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="date">Date *</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="status">Status *</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>&nbsp;</Label>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Marking...' : 'Mark Attendance'}
            </Button>
          </FormGroup>
        </Form>
      </FormSection>

      <div>
        <FormTitle>Attendance Records</FormTitle>
        <FilterSection>
          <FormGroup style={{ flex: '1 1 140px', minWidth: 0 }}>
            <Label htmlFor="filter_employee">Filter by Employee</Label>
            <Select
              id="filter_employee"
              value={filteredEmployee}
              onChange={(e) => setFilteredEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup style={{ flex: '1 1 140px', minWidth: 0 }}>
            <Label htmlFor="filter_date">Filter by Date</Label>
            <Input
              type="date"
              id="filter_date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </FormGroup>
          <FilterButton onClick={handleFilter}>Apply Employee Filter</FilterButton>
          <FilterButton onClick={handleClearFilter} style={{ background: '#dc2626' }}>
            Clear Filters
          </FilterButton>
        </FilterSection>

        {loading ? (
          <LoadingMessage>Loading attendance records...</LoadingMessage>
        ) : displayedAttendances.length === 0 ? (
          <EmptyState>No attendance records found. Mark attendance above.</EmptyState>
        ) : (
          <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {displayedAttendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.employee_name}</TableCell>
                  <TableCell>{attendance.employee_id}</TableCell>
                  <TableCell>{attendance.department}</TableCell>
                  <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={attendance.status}>
                      {attendance.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          </TableWrapper>
        )}
      </div>
    </Container>
  );
}

export default AttendanceManagement;
