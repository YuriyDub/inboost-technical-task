import { SelectNode } from './components/SelectorNode';
import { useTypedSelector } from './hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { setEdgeChanges, setNodeChanges } from './store/slices/graphSlice';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = { select: SelectNode };

function App() {
  const nodes = useTypedSelector((state) => state.graph.nodes);
  const edges = useTypedSelector((state) => state.graph.edges);

  const dispatch = useDispatch();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(nodeChanges) => dispatch(setNodeChanges(nodeChanges))}
        onEdgesChange={(edgeChanges) => dispatch(setEdgeChanges(edgeChanges))}
      />
    </div>
  );
}

export default App;
