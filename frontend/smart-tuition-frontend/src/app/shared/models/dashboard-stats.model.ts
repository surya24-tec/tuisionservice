export interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalBatches: number;
  totalFeesCollected: number;
  pendingFees: number;
  attendancePercentage: number;
}

export interface TeacherDashboardStats {
  studentCount: number;
  classesToday: number;
  testsCreated: number;
  avgAttendance: number;
  materialsCount: number;
  pendingReviews: number;
}

export interface StudentDashboardStats {
  attendance: number;
  totalMarks: number;
  pendingFees: number;
  materialsCount: number;
  upcomingTests: number;
  classesToday: number;
}
