import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import "../../styles/ticketspage.css";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/showtickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data.tickets);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tickets");
      }
    };

    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.get("http://localhost:5000/api/agents", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAgents(response.data.agents);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError(err.response?.data?.message || "Failed to fetch agents.");
      }
    };

    fetchTickets();
    fetchAgents();
  }, []);

  const handleSaveAssignments = async () => {
    try {
      const token = localStorage.getItem("token");

      for (const ticketId in selectedAgent) {
        if (selectedAgent[ticketId]) {
          await axios.put(
            `http://localhost:5000/api/tickets/${ticketId}/assign`,
            { agent_id: selectedAgent[ticketId] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      alert("Agents assigned successfully!");
      setShowDropdown(null);
    } catch (error) {
      console.error("Error assigning agents:", error);
      alert("Failed to assign agents.");
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h4 className="ticket-heading">All Tickets ({tickets.length})</h4>
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Description</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assign Agent</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.subject}</td>
                <td>{ticket.description || "No Description"}</td>
                <td>{ticket.category}</td>
                <td>
                  <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.priority}</td>
                <td>
                  {selectedAgent[ticket.ticket_id] ? (
                    <div className="agent-display">
                      <span>
                        <strong>Selected Agent:</strong>{" "}
                        {agents.find(a => a.user_id === selectedAgent[ticket.ticket_id])?.name || "Unknown"}
                      </span>
                      <button className="change-btn" onClick={() => setShowDropdown(ticket.ticket_id)}>
                        <i class="bi bi-arrow-repeat"></i>
                      </button>
                    </div>
                  ) : (
                    <button className="assign-btn" onClick={() => setShowDropdown(ticket.ticket_id)}>
                      Assign Agent
                    </button>
                  )}

                  {showDropdown === ticket.ticket_id && (
                    <div className="agent-dropdown">
                      <select
                        value={selectedAgent[ticket.ticket_id] || ""}
                        onChange={(e) =>
                          setSelectedAgent((prev) => ({
                            ...prev,
                            [ticket.ticket_id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                          <option key={agent.user_id} value={agent.user_id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="save-btn" onClick={handleSaveAssignments}>Save</button>
      </div>
    </>
  );
};

export default TicketsPage;
