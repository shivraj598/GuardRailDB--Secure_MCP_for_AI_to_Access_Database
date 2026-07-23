import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsLayout } from "@/components/DocsLayout"
import Home from "@/pages/Home"
import Install from "@/pages/Install"
import Usage from "@/pages/Usage"
import Changelog from "@/pages/Changelog"
import SignUp from "@/pages/SignUp"
import About from "@/pages/About"

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<DocsLayout />}>
            <Route index element={<Home />} />
            <Route path="install" element={<Install />} />
            <Route path="usage" element={<Usage />} />
            <Route path="changelog" element={<Changelog />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
