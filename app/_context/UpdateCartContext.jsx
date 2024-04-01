import React, { createContext, useState } from "react";

export const UpdateCartContext = createContext();

function UpdateCartProvider({ children }) {
  const [updateCart, setupdateCart] = useState(false);
  return (
    <UpdateCartContext.Provider value={{ updateCart, setupdateCart }}>
      {children}
    </UpdateCartContext.Provider>
  );
}

export default UpdateCartProvider;
