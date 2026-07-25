import { Outlet } from "react-router"

const MainLayout = () => {
  return (
    <div className="min-h-svh">
      <Outlet />
    </div>
  )
}

export default MainLayout
