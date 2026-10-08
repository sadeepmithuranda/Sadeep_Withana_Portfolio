import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Research from './pages/Research';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Project from './pages/Project';
import CV from './pages/CV';
import NotFound from './pages/NotFound';

// Clean URLs in production; hash routing only for the single-file preview build.
const Router = import.meta.env.MODE === 'preview' ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router basename={import.meta.env.MODE === 'preview' ? undefined : import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="research" element={<Research />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Article />} />
          <Route path="projects/:slug" element={<Project />} />
          <Route path="cv" element={<CV />} />
          <Route path="resume" element={<CV />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
