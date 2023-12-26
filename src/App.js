
import './App.css';
// import { Layer, Stage, Text } from 'react-konva';
// import ColoreRect from './ColorRect';
import DrawAnnotations from './DrawAnnotations';

function App() {
  return (
  //   <Stage width={window.innerWidth} height={window.innerHeight}>
  //   <Layer>
  //     <Text text="Try click on rect" />
  //     <ColoreRect />
  //   </Layer>
  // </Stage>
  <>
  {/* <h5>Start to draw</h5> */}
  <DrawAnnotations/>
  </>
  );
}

export default App;
