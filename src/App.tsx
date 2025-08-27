import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './pages/ProductList';


const Home = () => (
  <main className="max-w-4xl mx-auto py-8 px-4">
    <h2 className="text-2xl font-bold mb-2 text-pink-600 underline">Bienvenido a la tienda de móviles</h2>
    <p className="text-gray-700">Selecciona un producto para ver los detalles.</p>
  </main>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
