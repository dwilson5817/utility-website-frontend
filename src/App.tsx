import { Route, Routes } from "react-router"
import HomePage from "@/pages/home.tsx"
import EuropeTripPage from "@/pages/europe-trip.tsx"
import MainLayout from "@/layouts/main.tsx"

export function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="europe" element={<EuropeTripPage />} />
      </Route>
    </Routes>
  )
}

export default App
