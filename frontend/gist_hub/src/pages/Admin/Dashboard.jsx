import DashboardLayout from "../../components/layouts/DashboardLayout"

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome to the admin dashboard! Here you can manage users, view analytics, and configure settings.</p>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard