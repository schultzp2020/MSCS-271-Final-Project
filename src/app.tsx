import { Header, Grid } from '../components';

const App = (): JSX.Element => (
  <div className="h-screen w-screen overflow-auto bg-slate-200">
    <Header />
    <Grid />
  </div>
);

export default App;
