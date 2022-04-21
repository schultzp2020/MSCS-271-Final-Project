import { Header, Board } from '../components';

const App = (): JSX.Element => (
  <div className="h-screen w-screen overflow-auto bg-slate-200">
    <Header />
    <div className="mx-auto w-4/5 bg-white">
      <Board size={25} />
    </div>
  </div>
);

export default App;
