import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { employeeAPI, attendanceAPI } from '../services/api';

const DashboardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(15, 118, 110, 0.1);

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 10px;
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
    margin-bottom: 1.25rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  color: white;
  padding: 1.25rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  opacity: 0.92;
  margin-bottom: 0.35rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1.5rem;
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

const RecentSection = styled.div`
  margin-top: 1.75rem;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  color: #0f172a;
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  font-weight: 600;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 0.75rem;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 320px;
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

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendance: 0,
    presentToday: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [employeePresentDays, setEmployeePresentDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [employeesRes, attendanceRes] = await Promise.all([
          employeeAPI.getAll({ signal }),
          attendanceAPI.getAll({ signal }),
        ]);
        if (signal.aborted) return;

      const employees = employeesRes.data;
      const attendances = attendanceRes.data;
      const today = new Date().toISOString().split('T')[0];
      const presentToday = attendances.filter(
        (att) => att.date === today && att.status === 'Present'
      ).length;

      // Calculate present days per employee
      const presentDaysMap = {};
      attendances.forEach((att) => {
        if (att.status === 'Present') {
          const empId = att.employee || (att.employee_id ? employees.find(e => e.employee_id === att.employee_id)?.id : null);
          if (empId) {
            if (!presentDaysMap[empId]) {
              presentDaysMap[empId] = 0;
            }
            presentDaysMap[empId]++;
          }
        }
      });

      // Match with employees to get full details
      const presentDaysList = employees.map((emp) => ({
        employee_id: emp.employee_id,
        employee_name: emp.full_name,
        department: emp.department,
        count: presentDaysMap[emp.id] || 0,
      })).sort((a, b) => b.count - a.count);

      setStats({
        totalEmployees: employees.length,
        totalAttendance: attendances.length,
        presentToday,
      });

      // Get recent 5 attendance records
      setRecentAttendance(attendances.slice(0, 5));
      setEmployeePresentDays(presentDaysList);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  };

    fetchDashboardData();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingMessage>Loading dashboard...</LoadingMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <StatsGrid>
        <StatCard>
          <StatLabel>Total Employees</StatLabel>
          <StatValue>{stats.totalEmployees}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Attendance Records</StatLabel>
          <StatValue>{stats.totalAttendance}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Present Today</StatLabel>
          <StatValue>{stats.presentToday}</StatValue>
        </StatCard>
      </StatsGrid>

      <RecentSection>
        <SectionTitle>Total Present Days per Employee</SectionTitle>
        {employeePresentDays.length === 0 ? (
          <div style={{ color: '#64748b', padding: '1rem' }}>No attendance records yet.</div>
        ) : (
          <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell>Total Present Days</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {employeePresentDays.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{emp.employee_name}</TableCell>
                  <TableCell>{emp.employee_id}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>
                    <strong style={{ color: '#0f766e', fontSize: '1.05rem' }}>
                      {emp.count}
                    </strong>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          </TableWrapper>
        )}
      </RecentSection>

      <RecentSection>
        <SectionTitle>Recent Attendance</SectionTitle>
        {recentAttendance.length === 0 ? (
          <div style={{ color: '#64748b', padding: '1rem' }}>No attendance records yet.</div>
        ) : (
          <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {recentAttendance.map((att) => (
                <TableRow key={att.id}>
                  <TableCell>{att.employee_name}</TableCell>
                  <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        background: att.status === 'Present' ? '#d1fae5' : '#fee2e2',
                        color: att.status === 'Present' ? '#065f46' : '#991b1b',
                        fontWeight: '500',
                        fontSize: '0.85rem',
                      }}
                    >
                      {att.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          </TableWrapper>
        )}
      </RecentSection>
    </DashboardContainer>
  );
}

export default Dashboard;
