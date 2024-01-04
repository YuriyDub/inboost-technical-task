import { Handle, MarkerType, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';
import { Select } from '../UI/Select';
import { useDispatch } from 'react-redux';
import { addEdge, addNode, updateNodeValue } from '../../store/slices/graphSlice';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useEffect, useMemo } from 'react';
import { v1 } from 'uuid';
import styles from './SelectNode.module.scss';

const options = [
  { label: 'Варіант 1', value: '1' },
  { label: 'Варіант 2', value: '2' },
  { label: 'Варіант 3', value: '3' },
  { label: 'Варіант 4', value: '4' },
  { label: 'Варіант 5', value: '5' },
  { label: 'Варіант 6', value: '6' },
];

export type SelectNodeDataType = {
  value?: string;
};

export const SelectNode = ({ data, id }: NodeProps<SelectNodeDataType>) => {
  const nodes = useTypedSelector((state) => state.graph.nodes);
  const updateNodeInternals = useUpdateNodeInternals();
  const prefix = useMemo(() => {
    let prevValues = [];
    let parentNodeId = nodes.find((node) => node.id === id)?.parentNode;

    while (true) {
      if (!parentNodeId) {
        break;
      }
      const parentNode = nodes.find((node) => node.id === parentNodeId);
      prevValues.push(parentNode?.data.value);
      parentNodeId = parentNode?.parentNode;
    }
    return prevValues.reverse().join('-');
  }, [nodes, id]);

  const dispatch = useDispatch();

  const onChangeHandler = (option: string) => {
    if (!data.value) {
      const newId = v1();
      dispatch(
        addEdge({
          id: `e${id}-${newId}`,
          source: id,
          target: newId,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }),
      );
      dispatch(
        addNode({
          id: newId,
          type: 'select',
          position: { x: 300, y: 200 },
          data: {},
          parentNode: id,
        }),
      );
    }
    dispatch(updateNodeValue({ id: id, value: option }));
  };
  const showTopHandler = Boolean(prefix);
  const showBottomHandler = Boolean(data.value);

  useEffect(
    () => updateNodeInternals(id),
    [showTopHandler, showBottomHandler, updateNodeInternals, id],
  );

  return (
    <div className={styles.node}>
      {showTopHandler ? (
        <Handle type="target" position={Position.Top} className={styles.target} />
      ) : null}
      <div className={styles.body}></div>
      <Select
        {...data}
        renderValue={(value: string) => (
          <span>Варіант {prefix ? `${prefix}-${value}` : value}</span>
        )}
        placeholder={'Виберіть значення'}
        options={options}
        onChange={onChangeHandler}
        className="nodrag"
      />
      {showBottomHandler ? (
        <Handle type="source" position={Position.Right} className={styles.source} />
      ) : null}
    </div>
  );
};
