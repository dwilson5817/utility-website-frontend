import { Outlet } from "react-router"

const MainLayout = () => {
  return (
    <div className="py-6">
      <Outlet />
    </div>
  )
}

export default MainLayout
