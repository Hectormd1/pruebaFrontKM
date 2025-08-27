

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/:productName" element={<ProductDetail />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
