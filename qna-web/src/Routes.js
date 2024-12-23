// routes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./containers/Dashboard";
import DataConsole from "./containers/Dataconsole/";
import DataSet from "./containers/Dataconsole/";
import AiAssistant from "./containers/AiAssistant/";
import NotFound from "./components/NotFound";

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUserType = useSelector((state) => state.auth.user);

  return (
    <Routes>
      {isAuthenticated && currentUserType === "User" && (
        <>
          <Route path="/" element={<AiAssistant title="AI Assistant" pageID="ai-assistant" />} />
          {/* <Route
            path="/admin-console"
            element={<Dashboard title="Admin Console" />}
          /> */}
           <Route
            path="/ai-assistant"
            element={<AiAssistant title="AI Assistant" pageID="ai-assistant" />}
          />
        </>
      )}
      {isAuthenticated && currentUserType === "Admin" && (
        <>
          <Route
            path="/"
            element={<DataSet pageID="data_console" title="Data Console" />}
          />
          <Route
            path="/add-doc/:datasetNameParam"
            element={<DataConsole title="Add Document" pageID="add_doc" />}
          />
          <Route
            path="/data-console"
            element={<DataSet pageID="data_console" title="Data Console" />}
          />
          <Route
            path="/ai-assistant"
            element={<AiAssistant title="AI Assistant" pageID="ai-assistant" />}
          />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
