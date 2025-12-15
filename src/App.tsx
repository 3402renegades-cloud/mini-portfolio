import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TypingGame from "./apps/typing/TypingGame";
import SlotGame from "./apps/slot/SlotGame";
import Omikuji from "./apps/omikuji/Omikuji";
import Timer from "./apps/timer/Timer";

export default function App() {
  return (
    <HashRouter>
      <div className="shell">
        <header className="topbar">
          <div className="brand">Mini Portfolio</div>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/typing">Typing</NavLink>
            <NavLink to="/slot">Slot</NavLink>
            <NavLink to="/omikuji">Omikuji</NavLink>
            <NavLink to="/timer">Timer</NavLink>
          </nav>
        </header>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/typing" element={<TypingGame />} />
            <Route path="/slot" element={<SlotGame />} />
            <Route path="/omikuji" element={<Omikuji />} />
            <Route path="/timer" element={<Timer />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
