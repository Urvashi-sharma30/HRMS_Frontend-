import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { employeeAPI } from '../services/api';

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

const DeleteButton = styled.button`
  padding: 0.4rem 0.75rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #b91c1c;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 0.75rem;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 520px;
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

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async (config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll(config);
      if (config.signal?.aborted) return;
      setEmployees(response.data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError('Failed to load employees. Please try again.');
      console.error(err);
    } finally {
      if (!config.signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchEmployees({ signal: controller.signal });
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
      await employeeAPI.create(formData);
      setSuccess('Employee added successfully!');
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
      fetchEmployees();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.email?.[0] || 
                      err.response?.data?.employee_id?.[0] || 'Failed to add employee. Please try again.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setError(null);
      await employeeAPI.delete(id);
      setSuccess('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      console.error(err);
    }
  };

  return (
    <Container>
      <Title>Employee Management</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormSection>
        <FormTitle>Add New Employee</FormTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="employee_id">Employee ID *</Label>
            <Input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              required
              placeholder="e.g., EMP001"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              placeholder="e.g., John Doe"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="e.g., john@example.com"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="department">Department *</Label>
            <Input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              placeholder="e.g., Engineering"
            />
          </FormGroup>
          <FormGroup>
            <Label>&nbsp;</Label>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </FormGroup>
        </Form>
      </FormSection>

      <div>
        <FormTitle>All Employees</FormTitle>
        {loading ? (
          <LoadingMessage>Loading employees...</LoadingMessage>
        ) : employees.length === 0 ? (
          <EmptyState>No employees found. Add your first employee above.</EmptyState>
        ) : (
          <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Full Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <DeleteButton onClick={() => handleDelete(employee.id)}>
                      Delete
                    </DeleteButton>
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

export default EmployeeManagement;
