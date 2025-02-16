import React from 'react';
import Navbar from './Agent/Navbar';
import AssignedTickets from './Agent/AssignedTickets';


const AgentDashboard = () => {
    return (
        <>
            <Navbar />
            <AssignedTickets />;
        </>
    );
};

export default AgentDashboard;
