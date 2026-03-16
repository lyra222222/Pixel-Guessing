import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { LevelMap } from './pages/LevelMap';
import { Quiz } from './pages/Quiz';
import { Collection } from './pages/Collection';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/levels',
    Component: LevelMap,
  },
  {
    path: '/quiz/:levelId',
    Component: Quiz,
  },
  {
    path: '/collection',
    Component: Collection,
  },
]);
