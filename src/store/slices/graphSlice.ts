import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Node,
  Edge,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
  NodeAddChange,
} from 'reactflow';
import { SelectNodeDataType } from '../../components/SelectorNode/SelectNode';
import { v1 } from 'uuid';

interface GraphSliceState {
  nodes: Node<SelectNodeDataType>[];
  edges: Edge[];
}

const initialState = {
  nodes: [
    {
      id: v1(),
      type: 'select',
      position: { x: 0, y: 0 },
      data: {},
    },
  ],
  edges: [],
} as GraphSliceState;

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setEdgeChanges(state, { payload }: PayloadAction<EdgeChange[]>) {
      state.edges = applyEdgeChanges(payload, state.edges);
    },
    setNodeChanges(state, { payload }: PayloadAction<NodeChange[]>) {
      state.nodes = applyNodeChanges(payload, state.nodes);
    },
    addNode(state, { payload }: PayloadAction<Node>) {
      state.nodes = [...state.nodes, payload];
    },
    addEdge(state, { payload }: PayloadAction<Edge>) {
      state.edges = [...state.edges, payload];
    },
    updateNodeValue(state, { payload }: PayloadAction<{ id: string; value: string }>) {
      state.nodes = state.nodes.map((node) => {
        if (node.id === payload.id) {
          node.data.value = payload.value;
        }
        return node;
      });
    },
  },
});

export const { setEdgeChanges, setNodeChanges, addNode, addEdge, updateNodeValue } =
  graphSlice.actions;

export default graphSlice.reducer;
