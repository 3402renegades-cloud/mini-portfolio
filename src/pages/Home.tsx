import { Link } from "react-router-dom";
import "./Home.css"

export default function Home() {
  return (
    <main className="card">
      <h1>Mini Apps Portfolio</h1>
      <p>React + TypeScriptで作ったミニアプリ集です。</p>
      <ul>
        <li><Link to="/typing">Typing Game</Link></li>
        <li><Link to="/slot">Slot Game</Link></li>
        <li><Link to="/omikuji">Omikuji</Link></li>
        <li><Link to="/timer">Timer</Link></li>
      </ul>
    </main>
  );
}
