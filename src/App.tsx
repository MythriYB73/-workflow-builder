import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls, addEdge } from "reactflow";
import "reactflow/dist/style.css";

function App() {

  const [nodes, setNodes] = useState([
    {
      id: "1",
      position: { x: 250, y: 100 },
      data: { label: "Trigger Node" },
      type: "default"
    }
  ]);

  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    useEffect(() => {
  localStorage.setItem("workflowNodes", JSON.stringify(nodes));
  localStorage.setItem("workflowEdges", JSON.stringify(edges));
}, [nodes, edges]);
  };

  const addNode = (label) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: 250 + nodes.length * 50, y: 150 + nodes.length * 50 },
      data: { label },
      type: "default"
    };
    const deleteNode = () => {
  if (!selectedNode) return;

  setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
  setEdges((eds) =>
    eds.filter(
      (edge) =>
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
    )
  );

  setSelectedNode(null);
};

    setNodes([...nodes, newNode]);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{ width: "200px", padding: "10px", background: "#f4f4f4" }}>
        <h3>Nodes</h3>

        <button onClick={() => addNode("Trigger Node")}>Trigger</button>
        <br /><br />

        <button onClick={() => addNode("Email Node")}>Email</button>
        <br /><br />

        <button onClick={() => addNode("API Node")}>API</button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Settings Panel */}
      <div style={{ width: "200px", padding: "10px", background: "#f4f4f4" }}>
        <h3>Settings</h3>

        {selectedNode ? (
          <div>
            <p><b>Node ID:</b> {selectedNode.id}</p>
            <p><b>Node Label:</b> {selectedNode.data.label}</p>
            <br />

            <button onClick={deleteNode}>
             Delete Node
           </button>
          </div>
        ) : (
          <p>Select a node</p>
        )}

      </div>

    </div>
  );
}

export default App;