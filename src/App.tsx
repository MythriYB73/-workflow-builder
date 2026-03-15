import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls, addEdge } from "reactflow";
import "reactflow/dist/style.css";

function App() {

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [runningNodeId, setRunningNodeId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
  const saved = localStorage.getItem("workflow");

  if (saved) {
    const flow = JSON.parse(saved);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
  }
}, []);
useEffect(() => {
  localStorage.setItem("workflow", JSON.stringify({ nodes, edges }));
}, [nodes, edges]);
  
  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = (label) => {
    setNodes((nds) => [
      ...nds,
      {
        id: (nds.length + 1).toString(),
        position: { x: 200 + nds.length * 40, y: 150 + nds.length * 40 },
        data: { label },
        type: "default"
      }
    ]);
  };
  const runWorkflow = async () => {

  const triggerExists = nodes.some(
    (node) => node.data.label === "Trigger Node"
  );

  if (!triggerExists) {
    alert("Add a Trigger Node first");
    return;
  }

  if (edges.length === 0) {
    alert("Connect nodes before running workflow");
    return;
  }

  for (let node of nodes) {
    setRunningNodeId(node.id);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  setRunningNodeId(null);
  alert("Workflow finished");
};
const styledNodes = nodes.map((node) => ({
  ...node,
  style: {
    border: node.id === runningNodeId ? "3px solid red" : "1px solid #222",
    padding: 10
  }
}));
const exportWorkflow = () => {
  const data = JSON.stringify({ nodes, edges }, null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "workflow.json";
  a.click();
};
const importWorkflow = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);

    setNodes(data.nodes || []);
    setEdges(data.edges || []);
  };

  reader.readAsText(file);
};
  return (
    <div
  style={{
    display: "flex",
    height: "100vh",
    background: darkMode ? "#1e1e1e" : "#ffffff",
    color: darkMode ? "white" : "black"
  }}
>
      {/* Sidebar */}
      <div style={{ width: "200px", padding: "10px", background: "#f4f4f4" }}>
        <h3>Nodes</h3>

        <button onClick={() => addNode("Trigger Node")}>
          Trigger
        </button>

        <br /><br />

        <button onClick={() => addNode("Email Node")}>
          Email
        </button>

        <br /><br />

        <button onClick={() => addNode("API Node")}>
          API
        </button>
        <button onClick={() => setDarkMode(!darkMode)}>
  Toggle Dark Mode
</button>
       <button onClick={runWorkflow}>
Run Workflow
</button>
<br /><br />

<button onClick={exportWorkflow}>
Export Workflow
</button>

<br /><br />

<input type="file" onChange={importWorkflow} />
      </div>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
         nodes={styledNodes}
          edges={edges}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Settings Panel */}
      <div style={{
  width: "200px",
  padding: "10px",
  background: darkMode ? "#2c2c2c" : "#f4f4f4"
}}>
        <h3>Settings</h3>

        {selectedNode ? (
          <div>
            <p><b>ID:</b> {selectedNode.id}</p>
            <p><b>Label:</b> {selectedNode.data.label}</p>
          </div>
        ) : (
          <p>Select a node</p>
        )}
        <button onClick={() => {
  setNodes(nodes.filter(n => n.id !== selectedNode.id))
}}>
Delete Node
</button>

      </div>

    </div>
  );
}

export default App;