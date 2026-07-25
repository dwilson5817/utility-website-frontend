import { Route, Routes } from "react-router"
import HomePage from "@/pages/home.tsx"
import InterrailTripPage from "@/pages/interrail"
import MainLayout from "@/layouts/main.tsx"

export function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="interrail" element={<InterrailTripPage />} />
      </Route>
    </Routes>
  )
}

export default App
